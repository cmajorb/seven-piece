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
    map = MapTemplate.objects.get_or_create(name="Default Map", data=json.loads(maps_data), player_size=2, num_characters=2, color_scheme=scheme[0], score_to_win=5)
    
    #Characters
    soldier = Character.objects.get_or_create(name="Soldier", health=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has a lot of health")
    scout = Character.objects.get_or_create(name="Scout", health=2, speed=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Can move quickly")
    archer = Character.objects.get_or_create(name="Archer", health=2, attack_range_min=2, attack_range_max=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has distance attack")
    berserker = Character.objects.get_or_create(name="Berserker", health=2, attack=2, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has strong attack")
    ice_wizard = Character.objects.get_or_create(name="Ice Wizard", attack=0, special="Freeze", special_range = 2, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Freezes other pieces")

    #Testing
    # player_1 = Player.objects.get_or_create()
    # player_2 = Player.objects.get_or_create()
    # game_state = GameState.objects.get_or_create(map=map[0])
    
initial_setup()