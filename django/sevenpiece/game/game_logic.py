from game.models import GameState, Map, MapTemplate

def create_game(map_id):
    map_template = MapTemplate.objects.get(id=map_id)
    map = Map.objects.create(name = map_template.name, data = map_template.data, player_size = map_template.player_size,
    num_characters = map_template.num_characters, color_scheme = map_template.color_scheme,
    score_to_win = map_template.score_to_win)
    game_state = GameState.objects.create(map=map, single_player = True)
    return game_state