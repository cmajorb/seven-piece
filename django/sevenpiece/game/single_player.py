from game.models import GameState, Map, MapTemplate
import logging

logging.basicConfig(level=logging.INFO)

def execute_turn(player):
    if player.game.state == "PLAYING":
        for piece in player.piece_set.all():
            try:
                piece.make_move([piece.location_x, piece.location_y - 1])
            except:
                pass
            try:
                piece.refresh_from_db()
                piece.attack_piece([piece.location_x, piece.location_y - 1])
            except:
                pass