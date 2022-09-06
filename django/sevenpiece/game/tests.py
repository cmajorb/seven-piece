from django.test import TestCase
from game.models import Piece, Character, GameState, Map, ColorScheme
import json
from game.controller import make_move, take_damage, create_game, join_game, select_pieces, end_turn, attack
from game.exceptions import IllegalMoveError, JoinGameError
from django.contrib.auth.models import User

class PieceTestCase(TestCase):
    # def resetGame(self):
    #     self.game_state = GameState.objects.create(map=self.map, state=self.game_state_data)
    #     self.piece = Piece.objects.create(character=self.soldier, location_x=0, location_y=0, health=self.soldier.health, game=self.game_state, range=2)

    def setUp(self):
        #Color Schemes
        scheme_data = (open('sevenpiece/game/data/color_schemes.json')).read()
        scheme = ColorScheme.objects.create(name="Default Scheme", scheme=json.loads(scheme_data), max_player_size=2)

        #Maps
        maps_data = (open('sevenpiece/game/data/test_maps.json')).read()
        self.map = Map.objects.create(name="Test Map", data=json.loads(maps_data), player_size=2, num_characters=2, color_scheme=scheme)
        
        #Characters
        self.soldier = Character.objects.get_or_create(name="Soldier", health=3, attack=1, attack_range=1, speed=1, special="None", image="/images/soldier.png", description="Has a lot of health")
        self.berserker = Character.objects.get_or_create(name="Berserker", health=2, attack=2, attack_range=1, speed=1, special="None", image="/images/berserker.png", description="Has strong attack")
        self.ice_wizard = Character.objects.get_or_create(name="Ice Wizard", health=1, attack=0, attack_range=1, speed=1, special="Freeze", image="/images/ice_wizard.png", description="Freezes other pieces")

        #Game
        # self.game_state = GameState.objects.create(map=self.map, state=self.game_state_data)
        # self.piece = Piece.objects.create(character=self.soldier, location_x=0, location_y=0, health=self.soldier.health, game=self.game_state, range=2)

        self.user = User.objects.create_user(username='user1', password='12345')


    # def test_movement(self):
    #     make_move(self.piece.id,[1,1],self.game_state.session)

    #     self.piece.refresh_from_db()
    #     self.assertEqual(self.piece.location_x, 1)
    #     self.assertEqual(self.piece.location_y, 1)

    # def test_move_empty_tile(self):
    #     game_state = GameState.objects.all().first()
    #     piece = game_state.piece_set.all().first()
    #     with self.assertRaises(IllegalMoveError):
    #         make_move(piece.id,[0,4],game_state.session)
        

    # def test_attack(self):
    #     game_state = GameState.objects.all().first()
    #     for piece in game_state.piece_set.all():
    #         take_damage(piece.id,1)

    #     game_state = GameState.objects.all().first()
    #     for piece in game_state.piece_set.all():
    #         self.assertEqual(piece.health, piece.character.health - 1)

    def test_entire_game(self):
        game_state = create_game(self.user, self.map.id)
        user2 = User.objects.create_user(username='user2', password='12345')
        join_game(user2, game_state.session)
        pieces = ["Soldier", "Berserker"]
        pieces2 = select_pieces(user2, game_state.session, pieces)
        self.assertEqual(len(user2.piece_set.all()), len(pieces))
        pieces = ["Soldier", "Berserker"]
        pieces1 = select_pieces(self.user, game_state.session, pieces)

        game_state = make_move(pieces1[0].id,[1,1],game_state.session, self.user)
        print(game_state.get_game_summary())
        game_state = make_move(pieces1[1].id,[1,0],game_state.session, self.user)
        print(game_state.get_game_summary()) 
        game_state = make_move(pieces2[0].id,[3,3],game_state.session, user2)
        print(game_state.get_game_summary())
        game_state = make_move(pieces2[1].id,[4,3],game_state.session, user2)
        print(game_state.get_game_summary())

        game_state = make_move(pieces1[0].id,[2,2],game_state.session, self.user)
        print(game_state.get_game_summary())
        game_state = end_turn(game_state, self.user)
        print(game_state.get_game_summary())
        game_state = make_move(pieces2[0].id,[2,3],game_state.session, user2)
        print(game_state.get_game_summary())
        game_state = attack(game_state, [2,2], user2, pieces2[0].id)
        print(game_state.get_game_summary())

    def test_too_many_players_join(self):
        game_state = create_game(self.user, self.map.id)
        user2 = User.objects.create_user(username='test_user2', password='12345')
        user3 = User.objects.create_user(username='test_user3', password='12345')
        join_game(user2, game_state.session)
        with self.assertRaises(JoinGameError):
            join_game(user3, game_state.session)