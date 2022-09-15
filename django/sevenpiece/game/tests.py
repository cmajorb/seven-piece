from django.test import TestCase
from game.models import Character, Map, ColorScheme, Player, Piece, IceWizard
import json
from game.game_logic import create_game
from game.exceptions import JoinGameError
# from django.contrib.auth.models import User

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
        self.map = Map.objects.create(name="Test Map", data=json.loads(maps_data), player_size=2, num_characters=2, color_scheme=scheme, score_to_win=3)
        
        #Characters
        self.soldier = Character.objects.get_or_create(name="Soldier", health=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has a lot of health")
        self.scout = Character.objects.get_or_create(name="Scout", health=2, speed=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Can move quickly")
        self.archer = Character.objects.get_or_create(name="Archer", health=2, attack_range_min=2, attack_range_max=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has distance attack")
        self.berserker = Character.objects.get_or_create(name="Berserker", health=2, attack=2, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has strong attack")
        self.ice_wizard = Character.objects.get_or_create(name="Ice Wizard", attack=0, special="Freeze", special_range = 2, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Freezes other pieces")

            #Game
        # self.game_state = GameState.objects.create(map=self.map, state=self.game_state_data)
        # self.piece = Piece.objects.create(character=self.soldier, location_x=0, location_y=0, health=self.soldier.health, game=self.game_state, range=2)

        # self.user = User.objects.create_user(username='user1', password='12345')


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
        session0 = "123"
        session1 = "789"
        game_state = create_game(self.map.id)

        game_state.join_game(session0)
        game_state.join_game(session1)
        player1 = Player.objects.get(session=session0, game=game_state)
        player2 = Player.objects.get(session=session1, game=game_state)

        pieces = ["Berserker", "Ice Wizard"]
        pieces1 = player1.select_pieces(pieces)
        pieces = ["Berserker", "Soldier"]
        pieces2 = player2.select_pieces(pieces)
        self.assertEqual(len(Player.objects.get(session=session1).piece_set.all()), len(pieces))

        game_state = pieces1[0].make_move([1,1])
        print(game_state.get_game_summary())
        game_state = pieces1[1].make_move([1,0])
        print(game_state.get_game_summary()) 
        game_state = pieces2[0].make_move([3,3])
        print(game_state.get_game_summary())
        game_state = pieces2[1].make_move([4,3])
        print(game_state.get_game_summary())

        game_state = player1.end_turn()

        game_state = pieces1[0].make_move([2,2])
        print(game_state.get_game_summary())
        game_state = pieces1[1].make_move([2,1])
        print(game_state.get_game_summary())

        game_state = player1.end_turn()
        print(game_state.get_game_summary())
        game_state = pieces2[0].make_move([2,3])
        game_state = pieces2[1].make_move([3,2])
        print(game_state.get_game_summary())
        game_state = pieces2[0].attack_piece([2,2])
        print(game_state.get_game_summary())
        game_state = player2.end_turn()
        print(game_state.get_game_summary())
        pieces1[1].freeze_special([2,3])
        print(game_state.get_game_summary())
        print(game_state.get_game_state())

    def test_too_many_players_join(self):
        session0 = "123"
        session1 = "456"
        session2 = "789"
        game_state = create_game(self.map.id)
        # user2 = User.objects.create_user(username='test_user2', password='12345')
        # user3 = User.objects.create_user(username='test_user3', password='12345')
        game_state.join_game(session0)
        game_state.join_game(session1)
        with self.assertRaises(JoinGameError):
            game_state.join_game(session2)