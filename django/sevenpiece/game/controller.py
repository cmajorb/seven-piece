from game.models import Piece

def make_move(piece_id, location):
    piece = Piece.objects.get(id=piece_id)
    piece.location_x = location[0]
    piece.location_y = location[1]
    piece.save()

def take_damage(target_id, damage):
    target = Piece.objects.get(id=target_id)
    target.health -= damage
    target.save()
    