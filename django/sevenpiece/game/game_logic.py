from game.models import GameState, Map, Player

def create_game(map_id):
    map = Map.objects.get(id=map_id)
    game_state = GameState.objects.create(map=map)
    return game_state