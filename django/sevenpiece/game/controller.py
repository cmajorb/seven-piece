from game.models import Piece, GameState
from game.data.constants import MAP_DEFINITION

def make_move(piece_id, location, session):
    piece = Piece.objects.get(id=piece_id)
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
    