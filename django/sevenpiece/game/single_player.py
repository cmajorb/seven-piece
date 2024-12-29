import logging
from game.data.constants import MAP_DEFINITION
import math
import time
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import heapq
import traceback
from math import dist

logging.basicConfig(level=logging.INFO)
channel_layer = get_channel_layer()

INVALID_LOCATION = -1
SLEEP_DURATION = 1

def calculate_best_move(piece, objective, map_data):
    """
    Calculate the best move using A* pathfinding.
    Finds the shortest path to the objective and returns the next step.
    """
    # Handle case when there is no objective

    def heuristic_cost_estimate(start, goal):
        # Using Euclidean distance as the heuristic
        return dist(start, goal)
    
    def is_tile_safe(tile, enemy_pieces):
        """
        Determine if the tile is safe by checking if it lies within the attack range of any enemy piece.
        """
        for enemy in enemy_pieces:
            attack_tiles = calculate_attack_range(enemy)
            if tile in attack_tiles:
                return False
        return True
    
    def is_viable_counterattack(current_tile, enemy_pieces):
        """
        Check if moving to a tile allows for a counterattack on an opponent piece.
        """
        for enemy in enemy_pieces:
            if [enemy.location_x, enemy.location_y] == current_tile:
                # The piece can attack the enemy after moving
                return True
        return False
    
    def calculate_attack_range(piece):
        """
        Calculate all tiles within the attack range of a given piece.
        """
        attack_tiles = []
        for dx in range(-1, 2):
            for dy in range(-1, 2):
                if dx != 0 or dy != 0:
                    attack_tiles += get_attacks(
                        map_data,
                        piece.location_x,
                        piece.location_y,
                        dx,
                        dy,
                        piece.character.attack_range_min,
                        piece.character.attack_range_max,
                    )
        return attack_tiles

    def reconstruct_path(came_from, current):
        # Reconstruct the path to the current node
        path = []
        while current in came_from:
            path.append(current)
            current = came_from[current]
        path.reverse()  # Reverse the path to get start -> goal
        return path


    start = (piece.location_x, piece.location_y)
    open_set = [(0, start)]  # Priority queue with (f_score, position)
    came_from = {}  # Tracks the best previous step for each position
    g_score = {start: 0}  # Cost from start to each position
    f_score = {start: heuristic_cost_estimate(start, objective)}  # Total estimated cost to goal
    visited = set()  # Tracks visited tiles to prevent redundant processing

    enemy_pieces = piece.game.piece_set.exclude(player=piece.player)
    closest_tile = start
    closest_distance = heuristic_cost_estimate(start, objective)
    
    while open_set:
        _, current = heapq.heappop(open_set)  # Current node with the lowest f_score

        # Check if the objective is reached
        if current == tuple(objective):
            path = reconstruct_path(came_from, current)
            return path[0] if len(path) > 1 else current  # Return the first step toward the goal

        if current in visited:
            continue
        visited.add(current)

        # Get neighbors within the piece's speed
        neighbors = calculate_available_moves(current, map_data, piece.speed)

        for neighbor in neighbors:
            tile_safe = is_tile_safe(neighbor, enemy_pieces)
            # counterattack_viable = is_viable_counterattack(neighbor, enemy_pieces)

            # Penalize unsafe moves unless they allow for a counterattack
            # safety_penalty = 10 if not tile_safe and not counterattack_viable else 0
            safety_penalty = 10 if not tile_safe else 0

            # Calculate tentative g_score for the neighbor
            tentative_g_score = g_score[current] + 1 + safety_penalty

            # If this path to the neighbor is better, record it
            if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                # Calculate f_score using g_score + heuristic estimate
                f_score[neighbor] = tentative_g_score + heuristic_cost_estimate(neighbor, objective)
                heapq.heappush(open_set, (f_score[neighbor], neighbor))
                
                # Update the closest tile if this neighbor is closer to the objective
                distance_to_objective = heuristic_cost_estimate(neighbor, objective)
                if distance_to_objective < closest_distance:
                    closest_tile = neighbor
                    closest_distance = distance_to_objective

    # If no path to the objective is found, move toward the closest tile
    logging.warning(f"{piece} found no complete path to the objective. Moving toward the closest tile {closest_tile}.")
    if closest_tile != start:
        return closest_tile
    return start





# Enhanced Attack Decision Making
def calculate_best_attack(piece, enemy_pieces):
    """
    Evaluate and select the best target for attack based on scoring criteria.
    """
    best_target = None
    highest_score = -float("inf")

    for target in enemy_pieces:
        score = evaluate_target(piece, target)
        if score > highest_score:
            highest_score = score
            best_target = target

    return [best_target.location_x, best_target.location_y]


def evaluate_target(piece, target):
    map_data = piece.game.map.data["data"]
    x = target.location_x
    y = target.location_y
    tile_value = map_data[x][y]

    # Skip invalid targets
    if tile_value in (MAP_DEFINITION["empty"], MAP_DEFINITION["wall"]):
        return float('-inf')

    # Prioritize objectives, then enemy players
    priority = 0
    if tile_value & MAP_DEFINITION["objective"] == MAP_DEFINITION["objective"]:
        priority += 50
    if tile_value & MAP_DEFINITION["player"] == MAP_DEFINITION["player"] and target in piece.game.piece_set.exclude(player=piece.player):
        priority += 100

    # Add proximity to weight
    distance = math.dist([piece.location_x, piece.location_y], [x, y])
    return priority - distance


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
    if tiles:
        return min(tiles, key=lambda tile: math.dist(tile, location))
    else:
        return None


# Game State Handlers
def handle_playing_state(player, session):
    # game_map = player.game.map.data["data"]

    for piece in player.piece_set.all().filter(game=player.game):
        if piece.location_x != INVALID_LOCATION:
            piece.refresh_from_db()
            game_map = piece.game.map.data["data"]
            objectives = get_objectives(game_map, piece.game.objectives.split(","), player.number)
            piece = piece.cast_piece()
            closest_objective = find_closest_tile(objectives, [piece.location_x, piece.location_y])
            try:
                attack_and_update(piece, session)
            except Exception as e:
                handle_exception("Can't attack", e)
                traceback.print_exc()

            try:
                move_and_update(piece, closest_objective, session)
            except Exception as e:
                handle_exception("Can't move forward", e)
                traceback.print_exc()

            try:
                attack_and_update(piece, session)
            except Exception as e:
                handle_exception("Can't attack", e)
                traceback.print_exc()


def handle_placing_state(player, session):
    game_map = player.game.map.data["data"]
    objective_list = [0] * sum(x.count(MAP_DEFINITION["objective"]) for x in game_map)
    objectives = get_objectives(game_map, objective_list, player.number)
    closest_objective = find_closest_tile(
        objectives, player.game.map.data["start_tiles"][player.number][0]
    )

    for piece in player.piece_set.all().order_by('-speed'):
        try:
            place_piece_on_map(piece, player, closest_objective)
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
    enemy_pieces = get_enemy_pieces_in_range(piece)
    if enemy_pieces:
        target = calculate_best_attack(piece, enemy_pieces)
        if target:
            piece.attack_piece(target)
            piece.game.refresh_from_db()
            send_game_state_update(session, piece.game)
            time.sleep(SLEEP_DURATION)


def move_and_update(piece, objective, session):
    """Move the piece and update the game state."""
    map_data = piece.game.map.data["data"]
    new_move = calculate_best_move(piece, objective, map_data)
    if new_move != (piece.location_x, piece.location_y):  # Avoid redundant moves
        piece.make_move(new_move)
        piece.game.refresh_from_db()
        send_game_state_update(session, piece.game)
        time.sleep(SLEEP_DURATION)


def place_piece_on_map(piece, player, closest_objective):
    """Place the piece on the map."""
    player.game.refresh_from_db()
    game_map = player.game.map.data["data"]
    start_tiles = available_start_tiles(
        game_map, player.game.map.data["start_tiles"][player.number]
    )
    new_move = find_closest_tile(start_tiles, closest_objective)
    piece.make_move(new_move)


# Calculations and Helpers
def calculate_available_moves(current, map_data, speed):
    """Calculate all valid moves for a piece."""
    valid_moves = []
    x, y = current
    for dx in range(-1, 2):
        for dy in range(-1, 2):
            if dx != 0 or dy != 0:
                valid_moves += get_moves(
                    map_data, x, y, dx, dy, speed
                )
    return valid_moves

def get_enemy_pieces_in_range(piece):
    """Get all enemy pieces within attack range."""
    map_data = piece.game.map.data["data"]
    enemy_pieces = piece.game.piece_set.exclude(player=piece.player)

    valid_attacks = []
    for dx in range(-1, 2):
        for dy in range(-1, 2):
            if dx != 0 or dy != 0:
                attack_tiles = get_attacks(
                    map_data,
                    piece.location_x,
                    piece.location_y,
                    dx,
                    dy,
                    piece.character.attack_range_min,
                    piece.character.attack_range_max,
                )
                for tile in attack_tiles:
                    for enemy in enemy_pieces:
                        if [enemy.location_x, enemy.location_y] == tile:
                            valid_attacks.append(enemy)

    return valid_attacks

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


def available_start_tiles(map_data, start_tiles):
    available_tiles = []
    for start_tile in start_tiles:
        x, y = start_tile
        if map_data[x][y] == MAP_DEFINITION["normal"]:
            available_tiles.append(start_tile)
    return available_tiles

def get_objectives(map,current_scores,player_num):
    available_objectives = []
    i = 0
    for row in range(len(map)):
        for col in range(len(map[0])):
            if map[row][col] & MAP_DEFINITION["objective"] == MAP_DEFINITION["objective"]:
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
            if map[new_x][new_y] in [MAP_DEFINITION['normal'],MAP_DEFINITION["objective"]]:
                valid_moves.append((new_x,new_y))
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
            if map[new_x][new_y] in [MAP_DEFINITION['normal'],MAP_DEFINITION["objective"]] or distance < min_range:
                distance += 1
            elif map[new_x][new_y] & MAP_DEFINITION['player'] == MAP_DEFINITION['player']:
                return [[new_x,new_y]]
            else:
                return []
        else:
            return []
    return []