import logging
from game.data.constants import MAP_DEFINITION
import random

logging.basicConfig(level=logging.INFO)

def execute_turn(player):
    if player.game.state == "PLAYING":
        for piece in player.piece_set.all():
            try:
                available_moves = calculate_available_moves(piece)
                new_move = random.choice(available_moves)
                piece.make_move(new_move)
            except Exception as e:
                logging.info("Can't move forward {}".format(e))
                pass
            try:
                piece.refresh_from_db()
                available_attacks = calculate_available_attacks(piece)
                new_attack = random.choice(available_attacks)
                piece.attack_piece(new_attack)
            except Exception as e:
                logging.info("Can't attack {}".format(e))
                pass
    else:
        logging.info("Not in right phase")

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
                    logging.info(new_moves)
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
