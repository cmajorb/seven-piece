from django.test import TestCase
from game.models import Piece, Character, GameState, Map, ColorScheme
import json
from game.controller import make_move, take_damage
from game.exceptions import IllegalMoveError

class PieceTestCase(TestCase):
    # def resetGame(self):
    #     self.game_state = GameState.objects.create(map=self.map, state=self.game_state_data)
    #     self.piece = Piece.objects.create(character=self.soldier, location_x=0, location_y=0, health=self.soldier.health, game=self.game_state, range=2)

    def setUp(self):
        #Color Schemes
        scheme_data = (open('sevenpiece/game/data/color_schemes.json')).read()
        scheme = ColorScheme.objects.create(name="Default Scheme", scheme=json.loads(scheme_data), max_player_size=2)

        #Maps
        maps_data = (open('sevenpiece/game/data/maps.json')).read()
        self.map = Map.objects.create(name="Default Map", data=json.loads(maps_data), player_size=2, num_characters=2, color_scheme=scheme)
        
        #Characters
        self.soldier = Character.objects.create(name="Soldier", health=3, attack=1, speed=1, special="None", image="/images/soldier.png", description="Has a lot of health")

        #Game
        self.game_state_data = (open('sevenpiece/game/data/game_state.json')).read()
        self.game_state = GameState.objects.create(map=self.map, state=self.game_state_data)
        self.piece = Piece.objects.create(character=self.soldier, location_x=0, location_y=0, health=self.soldier.health, game=self.game_state, range=2)

    def test_movement(self):
        make_move(self.piece.id,[1,1],self.game_state.session)

        self.piece.refresh_from_db()
        self.assertEqual(self.piece.location_x, 1)
        self.assertEqual(self.piece.location_y, 1)

    def test_move_empty_tile(self):
        game_state = GameState.objects.all().first()
        piece = game_state.piece_set.all().first()
        with self.assertRaises(IllegalMoveError):
            make_move(piece.id,[0,4],game_state.session)
        

    def test_attack(self):
        game_state = GameState.objects.all().first()
        for piece in game_state.piece_set.all():
            take_damage(piece.id,1)

        game_state = GameState.objects.all().first()
        for piece in game_state.piece_set.all():
            self.assertEqual(piece.health, piece.character.health - 1)
