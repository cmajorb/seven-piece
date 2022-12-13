import uuid
import json
from game.models import *
from django.contrib.auth.models import User
import environ


def initial_setup():
    env = environ.Env()
    environ.Env.read_env()
    #Color Schemes
    scheme_data = (open('sevenpiece/game/data/color_schemes.json')).read()
    scheme = ColorScheme.objects.get_or_create(name="Default Scheme", scheme=json.loads(scheme_data), max_player_size=2)

    #Maps
    maps_data = (open('sevenpiece/game/data/maps.json')).read()
    for map in json.loads(maps_data)["maps"]:
        MapTemplate.objects.get_or_create(name=map["name"], data=map["db"], player_size=map["player_size"], num_characters=map["num_characters"], color_scheme=scheme[0], score_to_win=map["score_to_win"])

    #Characters
    soldier = Character.objects.get_or_create(name="Soldier", health=3, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Legionnaire%20Alvar.png", description="Begins the game with an additional life.")
    scout = Character.objects.get_or_create(name="Scout", health=2, speed=3, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Dumacke%20Exile.png", description="Able to move 1-3 spaces in a straight line. If moving 3 spaces, unable to attack that turn.")
    archer = Character.objects.get_or_create(name="Archer", health=2, attack_range_min=2, attack_range_max=3, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Dhampir%20Stalker.png", description="Attacks from 2 or 3 spaces away. Must attack before moving.")
    berserker = Character.objects.get_or_create(name="Berserker", health=2, attack=2, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Grum%20Flameblade.png", description="Attacks deal an additional point of damage.")
    ice_wizard = Character.objects.get_or_create(name="Ice Wizard", attack=0, special="Freeze", special_range_min = 1, special_range_max = 2, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Djinn%20Oshannus.png", description="Freezes opponents from 1-3 spaces away. Frozen pieces cannot attack or move on their next turn.")
    cleric = Character.objects.get_or_create(name="Cleric", image="https://d36mxiodymuqjm.cloudfront.net/card_art/Revealer.png", description="Adds a protective shield to friendly pieces. Shields block any amount of damage once before being destroyed.")
    werewolf = Character.objects.get_or_create(name="Werewolf", speed=2, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Vulguine.png", description="Gains 1 attack each time it deals damage.")
    
    User.objects.create_user(username='computer', password='12345')
    User.objects.create_superuser('admin', 'admin@example.com', env("ADMIN_PASSWORD"))

initial_setup()