import uuid
import json
from game.models import *
from django.contrib.auth.models import User
import environ


def initial_setup():
    env = environ.Env()
    environ.Env.read_env()
    User.objects.create_superuser('admin', 'admin@example.com', env("ADMIN_PASSWORD"))
    #Color Schemes
    scheme_data = (open('sevenpiece/game/data/color_schemes.json')).read()
    scheme = ColorScheme.objects.get_or_create(name="Default Scheme", scheme=json.loads(scheme_data), max_player_size=2)
    
    #Maps
    maps_data = (open('sevenpiece/game/data/maps.json')).read()
    map = Map.objects.get_or_create(name="Default Map", data=json.loads(maps_data), player_size=2, num_characters=2, color_scheme=scheme[0])
    
    #Characters
    soldier = Character.objects.get_or_create(name="Soldier", health=3, attack=1, speed=1, special="None", image="/images/soldier.png", description="Has a lot of health")
    berserker = Character.objects.get_or_create(name="Berserker", health=2, attack=2, speed=1, special="None", image="/images/berserker.png", description="Has strong attack")
    ice_wizard = Character.objects.get_or_create(name="Ice Wizard", health=1, attack=0, speed=1, special="Freeze", image="/images/ice_wizard.png", description="Freezes other pieces")

    #Testing
    game_state_data = (open('sevenpiece/game/data/game_state.json')).read()
    game_state = GameState.objects.get_or_create(session=uuid.uuid4(), map=map[0], state=game_state_data)
    
initial_setup()