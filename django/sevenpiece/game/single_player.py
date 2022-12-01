import logging
from game.data.constants import MAP_DEFINITION
import random
import math
import time
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logging.basicConfig(level=logging.INFO)
channel_layer = get_channel_layer()

def execute_turn(player,session):
    game_map = player.game.map.data["data"]
    if player.game.state == "PLAYING":
        available_objectives = get_objectives(game_map,player.game.objectives.split(","),player.number)
        for piece in player.piece_set.all().filter(game=player.game):
            closest_objective = closest_tile(available_objectives, [piece.location_x,piece.location_y])
            try:
                piece.refresh_from_db()
                available_attacks = calculate_available_attacks(piece)
                new_attack = random.choice(available_attacks)
                piece.attack_piece(new_attack)
                player.game.refresh_from_db()
                async_to_sync(channel_layer.group_send)(
                    session,
                    {"type": "game_state",
                    "state": player.game.get_game_state()}
                )
                time.sleep(1)
            except Exception as e:
                logging.info("Can't attack {}".format(e))
            try:
                available_moves = calculate_available_moves(piece)
                new_move = closest_tile(available_moves, closest_objective)
                # new_move = random.choice(available_moves)
                piece.make_move(new_move)
                player.game.refresh_from_db()
                async_to_sync(channel_layer.group_send)(
                    session,
                    {"type": "game_state",
                    "state": player.game.get_game_state()}
                )
                time.sleep(1)
            except Exception as e:
                logging.info("Can't move forward {}".format(e))
            try:
                piece.refresh_from_db()
                available_attacks = calculate_available_attacks(piece)
                new_attack = random.choice(available_attacks)
                piece.attack_piece(new_attack)
                player.game.refresh_from_db()
                async_to_sync(channel_layer.group_send)(
                    session,
                    {"type": "game_state",
                    "state": player.game.get_game_state()}
                )
                time.sleep(1)
            except Exception as e:
                logging.info("Can't attack {}".format(e))

    elif player.game.state == "PLACING":
        objective_list = [0] * sum(x.count(MAP_DEFINITION['objective']) for x in game_map)
        available_objectives = get_objectives(game_map,objective_list,player.number)
        closest_objective = closest_tile(available_objectives, player.game.map.data["start_tiles"][player.number][0])
        
        for piece in player.piece_set.all():
            try:
                player.game.refresh_from_db()
                game_map = player.game.map.data["data"]
                available_tiles = available_start_tiles(game_map, player.game.map.data["start_tiles"][player.number])
                new_move = closest_tile(available_tiles, closest_objective)
                piece.make_move(new_move)
            except Exception as e:
                logging.info("Can't place {}".format(e))
    else:
        logging.info("Not in right phase")

def available_start_tiles(map, start_tiles):
    available_tiles = []
    for start_tile in start_tiles:
        if map[start_tile[0]][start_tile[1]] == MAP_DEFINITION['normal']:
            available_tiles.append(start_tile)
    return available_tiles

def closest_tile(tiles, location):
    distances = []
    for tile in tiles:
        distances.append(math.dist(tile,location))
    return tiles[distances.index(min(distances))]

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

def calculate_available_moves(piece):
    valid_moves = []
    map = piece.game.map.data["data"]
    piece_range = piece.speed
    for x in range(-1,2):
        for y in range(-1,2):
            if x != 0 or y != 0:
                new_moves = get_moves(map,piece.location_x,piece.location_y,x,y,piece_range)
                if new_moves:
                    valid_moves += new_moves
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

def calculate_available_attacks(piece):
    valid_attacks = []
    map = piece.game.map.data["data"]
    current_pieces = piece.game.piece_set.all().filter(player=piece.player)
    piece_locations = [[piece.location_x,piece.location_y] for piece in current_pieces]
    
    for x in range(-1,2):
        for y in range(-1,2):
            if x != 0 or y != 0:
                new_attacks = get_attacks(map,piece.location_x,piece.location_y,x,y,piece.character.attack_range_min,piece.character.attack_range_max)
                if new_attacks:
                    valid_attacks += new_attacks
    return [location for location in valid_attacks if location not in piece_locations]
