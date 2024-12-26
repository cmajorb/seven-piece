import logging
from game.data.constants import MAP_DEFINITION
import random
import math
import time
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logging.basicConfig(level=logging.INFO)
channel_layer = get_channel_layer()

INVALID_LOCATION = -1
SLEEP_DURATION = 1

def send_game_state_update(session, game):
    """Send updated game state to the channel."""
    async_to_sync(channel_layer.group_send)(
        session,
        {"type": "game_state", "state": game.get_game_state()}
    )


def handle_exception(message, exception):
    """Log exceptions with context."""
    logging.info(f"{message}: {exception}")


def find_closest_tile(tiles, location):
    """Find the closest tile to the given location."""
    return min(tiles, key=lambda tile: math.dist(tile, location))


# Game State Handlers
def handle_playing_state(player, session):
    game_map = player.game.map.data["data"]
    objectives = get_objectives(game_map, player.game.objectives.split(","), player.number)

    for piece in player.piece_set.all().filter(game=player.game):
        if piece.location_x != INVALID_LOCATION:
            piece = piece.cast_piece()
            closest_objective = find_closest_tile(objectives, [piece.location_x, piece.location_y])

            try:
                piece.refresh_from_db()
                attack_and_update(piece, session)
            except Exception as e:
                handle_exception("Can't attack", e)

            try:
                move_and_update(piece, closest_objective, session)
            except Exception as e:
                handle_exception("Can't move forward", e)

            try:
                attack_and_update(piece, session)
            except Exception as e:
                handle_exception("Can't attack", e)


def handle_placing_state(player, session):
    game_map = player.game.map.data["data"]
    objective_list = [0] * sum(x.count(MAP_DEFINITION["objective"]) for x in game_map)
    objectives = get_objectives(game_map, objective_list, player.number)
    closest_objective = find_closest_tile(
        objectives, player.game.map.data["start_tiles"][player.number][0]
    )

    for piece in player.piece_set.all():
        try:
            place_piece_on_map(piece, player, game_map, closest_objective)
        except Exception as e:
            handle_exception("Can't place", e)


def execute_turn(player, session):
    """Main function to execute a player's turn."""
    if player.game.state == "PLAYING":
        handle_playing_state(player, session)
    elif player.game.state == "PLACING":
        handle_placing_state(player, session)
    else:
        logging.info("Not in the correct phase")


# Actions
def attack_and_update(piece, session):
    """Perform an attack and update the game state."""
    available_attacks = calculate_available_attacks(piece)
    if available_attacks:
        piece.attack_piece(random.choice(available_attacks))
        piece.game.refresh_from_db()
        send_game_state_update(session, piece.game)
        time.sleep(SLEEP_DURATION)


def move_and_update(piece, objective, session):
    """Move the piece and update the game state."""
    available_moves = calculate_available_moves(piece)
    if available_moves:
        new_move = find_closest_tile(available_moves, objective)
        piece.make_move(new_move)
        piece.game.refresh_from_db()
        send_game_state_update(session, piece.game)
        time.sleep(SLEEP_DURATION)


def place_piece_on_map(piece, player, game_map, closest_objective):
    """Place the piece on the map."""
    player.game.refresh_from_db()
    start_tiles = available_start_tiles(
        game_map, player.game.map.data["start_tiles"][player.number]
    )
    new_move = find_closest_tile(start_tiles, closest_objective)
    piece.make_move(new_move)


# Calculations and Helpers
def calculate_available_moves(piece):
    """Calculate all valid moves for a piece."""
    map_data = piece.game.map.data["data"]
    valid_moves = []

    for dx in range(-1, 2):
        for dy in range(-1, 2):
            if dx != 0 or dy != 0:
                valid_moves += get_moves(
                    map_data, piece.location_x, piece.location_y, dx, dy, piece.speed
                )
    return valid_moves


def calculate_available_attacks(piece):
    """Calculate all valid attacks for a piece."""
    map_data = piece.game.map.data["data"]
    current_pieces = piece.game.piece_set.all().filter(player=piece.player)
    piece_locations = [[p.location_x, p.location_y] for p in current_pieces]
    valid_attacks = []

    for dx in range(-1, 2):
        for dy in range(-1, 2):
            if dx != 0 or dy != 0:
                new_attacks = get_attacks(
                    map_data,
                    piece.location_x,
                    piece.location_y,
                    dx,
                    dy,
                    piece.character.attack_range_min,
                    piece.character.attack_range_max,
                )
                if new_attacks:
                    valid_attacks += new_attacks

    return [location for location in valid_attacks if location not in piece_locations]


def available_start_tiles(map, start_tiles):
    available_tiles = []
    for start_tile in start_tiles:
        if map[start_tile[0]][start_tile[1]] == MAP_DEFINITION['normal']:
            available_tiles.append(start_tile)
    return available_tiles

def get_objectives(map,current_scores,player_num):
    available_objectives = []
    i = 0
    for row in range(len(map)):
        for col in range(len(map[0])):
            if map[row][col] & MAP_DEFINITION['objective'] == MAP_DEFINITION['objective']:
                if current_scores[i] != str(player_num):
                    available_objectives.append([row,col])
                i+=1
    return available_objectives

def get_moves(map,x,y,dir_x,dir_y,max_range):
    map_length_x = len(map)
    map_length_y = len(map[0])
    valid_moves = []
    distance = 1
    while distance <= max_range:
        new_x = x+(dir_x*distance)
        new_y = y+(dir_y*distance)
        if new_x < map_length_x and new_y < map_length_y and new_x >= 0 and new_y >= 0: 
            if map[new_x][new_y] in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']]:
                valid_moves.append([new_x,new_y])
                distance += 1
            else:
                return valid_moves
        else:
            return valid_moves
    return valid_moves


def get_attacks(map,x,y,dir_x,dir_y,min_range,max_range):
    map_length_x = len(map)
    map_length_y = len(map[0])
    distance = 1
    while distance <= max_range:
        new_x = x+(dir_x*distance)
        new_y = y+(dir_y*distance)
        if new_x < map_length_x and new_y < map_length_y and new_x >= 0 and new_y >= 0: 
            if map[new_x][new_y] in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']] or distance < min_range:
                distance += 1
            elif map[new_x][new_y] & MAP_DEFINITION['player'] == MAP_DEFINITION['player']:
                return [[new_x,new_y]]
            else:
                return
        else:
            return