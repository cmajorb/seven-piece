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
    for map in json.loads(maps_data)["maps"]:
        MapTemplate.objects.get_or_create(name=map["name"], data=map["db"], player_size=map["player_size"], num_characters=map["num_characters"], color_scheme=scheme[0], score_to_win=map["score_to_win"])

    #Characters
    soldier = Character.objects.get_or_create(name="Soldier", health=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has a lot of health")
    scout = Character.objects.get_or_create(name="Scout", health=2, speed=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Can move quickly")
    archer = Character.objects.get_or_create(name="Archer", health=2, attack_range_min=2, attack_range_max=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has distance attack")
    berserker = Character.objects.get_or_create(name="Berserker", health=2, attack=2, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has strong attack")
    ice_wizard = Character.objects.get_or_create(name="Ice Wizard", attack=0, special="Freeze", special_range_min = 1, special_range_max = 2, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Freezes other pieces")
    
initial_setup()