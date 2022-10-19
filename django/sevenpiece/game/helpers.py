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
    soldier = Character.objects.get_or_create(name="Soldier", health=3, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Legionnaire%20Alvar.png", description="A combatant of unrivaled survivability, the Soldier endures where lesser beings would have succumbed long ago.")
    scout = Character.objects.get_or_create(name="Scout", health=2, speed=3, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Dumacke%20Exile.png", description="The Scout is able to traverse great swaths of the battlefield, and is capable of executing flanking manuevers that other combatants would find nearly impossible.")
    archer = Character.objects.get_or_create(name="Archer", health=2, attack_range_min=2, attack_range_max=3, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Dhampir%20Stalker.png", description="Able to deal damage from a distance, the Archer is excellent at detering enemies from approaching.")
    berserker = Character.objects.get_or_create(name="Berserker", health=2, attack=2, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Grum%20Flameblade.png", description="There are few who can match the sheer brutality of the Berserker, and fewer still who can match its proficiency with a blade.")
    ice_wizard = Character.objects.get_or_create(name="Ice Wizard", attack=0, special="Freeze", special_range_min = 1, special_range_max = 2, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Djinn%20Oshannus.png", description="While the Ice Wizard is untrained in physical combat, is practiced in immobilizing its enemies from a distance.")
    cleric = Character.objects.get_or_create(name="Cleric", image="https://d36mxiodymuqjm.cloudfront.net/card_art/Revealer.png", description="Exiled from a monastary long ago, the Cleric practices archane arts, granting a magical shield to its allies.")
    werewolf = Character.objects.get_or_create(name="Werewolf", speed=2, image="https://d36mxiodymuqjm.cloudfront.net/card_art/Vulguine.png", description="Those seeking to slay the Werewolf, take note: it grows stronger with every blow. Perhaps it would be better to unleash it upon your enemies instead?")
    
    User.objects.create_superuser('admin', 'admin@example.com', env("ADMIN_PASSWORD"))

initial_setup()