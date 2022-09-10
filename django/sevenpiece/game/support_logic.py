from game.models import Player
from game.data.constants import MAP_DEFINITION
from game.exceptions import IllegalMoveError
from game.game_logic import  start_game

def is_range_valid(piece, location, board, range_min, range_max):
    map_length_x = len(board)
    map_length_y = len(board[0])
    x_diff = abs(piece.location_x - location[0])
    y_diff = abs(piece.location_y - location[1])
    if location[0] < map_length_x and location[1] < map_length_y and location[0] >= 0 and location[1] >= 0: 
        if piece.location_x == location[0] and y_diff <= range_max and y_diff >= range_min:
            return True
        elif piece.location_y == location[1] and x_diff <= range_max and x_diff >= range_min:
            return True
        elif x_diff == y_diff and x_diff <= range_max and x_diff >= range_min:
            return True
    return False

def capture_objective(game_state, player_number, location):
    flat_board = sum(game_state.map.data["data"], [])
    current_scores = game_state.objectives.split(",")
    flat_location = location[0] * len(game_state.map.data["data"][0]) + location[1]
    score_location = 0
    for i, val in enumerate(flat_board):
        if i == flat_location:
            break
        if val & MAP_DEFINITION['objective'] == MAP_DEFINITION['objective']:
            score_location += 1
    current_scores[score_location] = str(player_number)
    game_state.objectives = ",".join(current_scores)
    game_state.save()

def move_piece(piece, location, game_state):
    print("Player {} moved {} to ({}, {})".format(piece.player.number, piece.character.name, location[0], location[1]))
    previous_x = piece.location_x
    previous_y = piece.location_y

    #For Scout
    if max(abs(piece.location_x - location[0]), abs(piece.location_y - location[1])) == 3:
        piece.attack = 0
    piece.location_x = location[0]
    piece.location_y = location[1]
    piece.speed = 0
    piece.save()

    board = game_state.map.data["data"]
    if board[location[0]][location[1]] == MAP_DEFINITION['objective']:
        capture_objective(game_state, piece.player.number, location)
        print("Captured Objective!")
    board[previous_x][previous_y] &=  ~MAP_DEFINITION['player']
    board[location[0]][location[1]] |=  MAP_DEFINITION['player']
    game_state.map.data["data"] = board
    game_state.map.save()

def place_piece(piece, location, game_state, player_num):
    valid_tiles = game_state.map.data["start_tiles"][player_num]
    if location in valid_tiles:
        move_placed_piece(piece, location, game_state)
    else:
        raise IllegalMoveError

    #Check to see if all pieces are placed
    if len(game_state.piece_set.all().filter(location_x__isnull=False)) == game_state.map.num_characters * game_state.map.player_size:
        start_game(game_state)

def move_placed_piece(piece, location, game_state):
    piece.location_x = location[0]
    piece.location_y = location[1]
    piece.save()

    board = game_state.map.data["data"]
    board[location[0]][location[1]] |=  MAP_DEFINITION['player']
    game_state.map.data["data"] = board
    game_state.map.save()

def take_damage(target, damage):
    target.health -= damage
    target.save()
    return target

def is_current_turn(game_state, user):
    return game_state.turn_count % game_state.map.player_size == Player.objects.get(game=game_state, user=user).number

def remove_piece(game_state, target_piece, piece):
    target_piece.health = 0
    piece.player.score += target_piece.point_value
    piece.player.save()
    game_state.map.data["data"][target_piece.location_x][target_piece.location_y] &=  ~MAP_DEFINITION['player']
    game_state.map.save()
    target_piece.point_value = 0
    target_piece.location_x = -1
    target_piece.location_y = -1
    target_piece.save()
    
def get_piece_by_location(game_state, location):
    return game_state.piece_set.all().filter(location_x=location[0], location_y=location[1]).first()
