from game.models import GameState, Map, Player
from game.data.constants import MAP_DEFINITION
from game.exceptions import GameDoesNotExist, JoinGameError

def create_game(user, map_id):
    map = Map.objects.get(id=map_id)
    game_state = GameState.objects.create(map=map)
    Player.objects.create(user=user, game=game_state, number=0)
    return game_state

def join_game(user, session):
    try:
        game_state = GameState.objects.get(session=session)
    except:
        raise GameDoesNotExist
    num_of_players = len(game_state.player_set.all())
    if num_of_players >= game_state.map.player_size:
        raise JoinGameError
    Player.objects.create(user=user, game=game_state, number=num_of_players)
    if num_of_players + 1 == game_state.map.player_size:
        game_state.state = "READY"
        game_state.save()
    return game_state

def init_game(game_state):
    game_state.state = "PLACING"
    for piece in game_state.piece_set.all():
        piece.health = piece.character.health
        piece.range = piece.character.speed
        piece.attack = piece.character.attack
        piece.save()
    game_state.save()

def start_game(game_state):
    game_state.state = "PLAYING"
    objectives = []
    for val in sum(game_state.map.data["data"], []):
        if val == MAP_DEFINITION['objective']:
            objectives.append("-1")
    game_state.objectives = ",".join(objectives)
    game_state.save()

def end_game(game_state, winner):
    print("The winner is player {}".format(winner.number))
    game_state.state = "FINISHED"
    #Delete the game_state?