from game.models import GameState, Map, Player

def create_game(user, map_id):
    map = Map.objects.get(id=map_id)
    game_state = GameState.objects.create(map=map)
    Player.objects.create(user=user, game=game_state, number=0)
    return game_state