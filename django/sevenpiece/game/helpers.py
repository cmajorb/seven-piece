import uuid
import json
from game.models import *

def initial_setup():
    #Color Schemes
    scheme_data = (open('sevenpiece/game/data/color_schemes.json')).read()
    scheme = ColorScheme.objects.get_or_create(name="Default Scheme", scheme=json.loads(scheme_data), max_player_size=2)
    
    #Maps
    maps_data = (open('sevenpiece/game/data/maps.json')).read()
    map = Map.objects.get_or_create(name="Default Map", data=maps_data, player_size=2, num_characters=2, color_scheme=scheme[0])
    
    #Characters
    soldier = Character.objects.get_or_create(name="Soldier", health=3, attack=1, speed=1, special="None", image="/images/soldier.png", description="Has a lot of health")

    #Testing
    game_state_data = (open('sevenpiece/game/data/game_state.json')).read()
    game_state = GameState.objects.get_or_create(session=uuid.uuid4(), map=map[0], state=game_state_data)
    