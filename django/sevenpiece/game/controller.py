from game.models import Piece, GameState
from game.data.constants import MAP_DEFINITION
from game.exceptions import IllegalMoveError

def is_range_valid(piece, location, board):
    map_length_x = len(board)
    map_length_y = len(board[0])
    x_diff = abs(piece.location_x - location[0])
    y_diff = abs(piece.location_y - location[1])
    if location[0] < map_length_x and location[1] < map_length_y and location[0] >= 0 and location[1] >= 0: 
        if piece.location_x == location[0] and y_diff <= piece.range:
            return True
        elif piece.location_y == location[1] and x_diff <= piece.range:
            return True
        elif x_diff == y_diff and x_diff <= piece.range:
            return True
    return False

def make_move(piece_id, location, session):
    game_state = GameState.objects.get(session=session)
    board = game_state.map.data["data"]
    piece = Piece.objects.get(id=piece_id)
    #check if piece still has moves
    #check if piece has range
    if not is_range_valid(piece, location, board):
        print("Out of range")
        raise IllegalMoveError
    #check if tile is valid (normal,objective)
    if board[location[0]][location[1]] not in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']]:
        print("Not a valid tile")
        raise IllegalMoveError
    move_piece(piece, location, session)

def move_piece(piece, location, session):
    previous_x = piece.location_x
    previous_y = piece.location_y

    piece.location_x = location[0]
    piece.location_y = location[1]
    piece.save()

    game_state = GameState.objects.get(session=session)
    board = game_state.map.data["data"]
    board[previous_x][previous_y] &=  ~MAP_DEFINITION['player']
    board[location[0]][location[1]] |=  MAP_DEFINITION['player']
    game_state.map.data["board"] = board
    game_state.map.save()

def take_damage(target_id, damage):
    target = Piece.objects.get(id=target_id)
    target.health -= damage
    target.save()
    