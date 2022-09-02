from django.test import TestCase
from game.models import Piece, Character, GameState, Map, ColorScheme
import json
from game.controller import make_move, take_damage

class PieceTestCase(TestCase):
    def setUp(self):
        #Color Schemes
        scheme_data = (open('sevenpiece/game/data/color_schemes.json')).read()
        scheme = ColorScheme.objects.create(name="Default Scheme", scheme=json.loads(scheme_data), max_player_size=2)

        #Maps
        maps_data = (open('sevenpiece/game/data/maps.json')).read()
        map = Map.objects.create(name="Default Map", data=json.loads(maps_data), player_size=2, num_characters=2, color_scheme=scheme)
        
        #Characters
        soldier = Character.objects.create(name="Soldier", health=3, attack=1, speed=1, special="None", image="/images/soldier.png", description="Has a lot of health")

        #Game
        game_state_data = (open('sevenpiece/game/data/game_state.json')).read()
        game_state = GameState.objects.create(map=map, state=game_state_data)
        Piece.objects.create(character=soldier, location_x=0, location_y=0, health=soldier.health, game=game_state)

    def test_movement(self):
        game_state = GameState.objects.all().first()
        for piece in game_state.piece_set.all():
            make_move(piece.id,[1,1],game_state.session)

        game_state = GameState.objects.all().first()
        for piece in game_state.piece_set.all():
            self.assertEqual(piece.location_x, 1)
            self.assertEqual(piece.location_y, 1)
            
    def test_attack(self):
        game_state = GameState.objects.all().first()
        for piece in game_state.piece_set.all():
            take_damage(piece.id,1)

        game_state = GameState.objects.all().first()
        for piece in game_state.piece_set.all():
            self.assertEqual(piece.health, piece.character.health - 1)