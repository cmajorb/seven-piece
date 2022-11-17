from django.test import TestCase
from game.models import Character, ColorScheme, Player, MapTemplate
import json
from game.game_logic import create_game
from game.exceptions import IllegalMoveError
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
        self.map = MapTemplate.objects.create(name="Test Map", data=json.loads(maps_data), player_size=2, num_characters=2, color_scheme=scheme, score_to_win=5)
        self.map2 = MapTemplate.objects.create(name="Test Map", data=json.loads(maps_data), player_size=2, num_characters=2, color_scheme=scheme, score_to_win=2)

        #Characters
        self.soldier = Character.objects.get_or_create(name="Soldier", health=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has a lot of health")
        self.scout = Character.objects.get_or_create(name="Scout", health=2, speed=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Can move quickly")
        self.archer = Character.objects.get_or_create(name="Archer", health=2, attack_range_min=2, attack_range_max=3, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has distance attack")
        self.berserker = Character.objects.get_or_create(name="Berserker", health=2, attack=2, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Has strong attack")
        self.ice_wizard = Character.objects.get_or_create(name="Ice Wizard", attack=0, special="Freeze", special_range_min = 1, special_range_max = 2, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Freezes other pieces")
        self.cleric = Character.objects.get_or_create(name="Cleric", image="https://www.svgrepo.com/show/153027/warrior.svg", description="Gives a shield to other pieces while alive")
        self.werewolf = Character.objects.get_or_create(name="Werewolf", speed=2, image="https://www.svgrepo.com/show/153027/warrior.svg", description="Gains an attack every time it deals damage")


            #Game
        # self.game_state = GameState.objects.create(map=self.map, state=self.game_state_data)
        # self.piece = Piece.objects.create(character=self.soldier, location_x=0, location_y=0, health=self.soldier.health, game=self.game_state, range=2)

        self.user1 = User.objects.create_user(username='user1', password='12345')
        self.user2 = User.objects.create_user(username='user2', password='54321')


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

    def test_win_by_objectives(self):
        print("=====TESTING WIN BY OBJECTIVES=====")
        game_state = create_game(self.map2.id)

        player1 = game_state.join_game(self.user1.id)[1]
        player2 = game_state.join_game(self.user2.id)[1]

        pieces = ["Berserker", "Ice Wizard"]
        pieces1 = player1.select_pieces(pieces)
        pieces = ["Cleric", "Soldier"]
        pieces2 = player2.select_pieces(pieces)
        self.assertEqual(len(Player.objects.get(user=self.user1.id).piece_set.all()), len(pieces))

        game_state = pieces1[0].make_move([1,1])
        game_state = pieces1[1].make_move([1,0])
        game_state = pieces2[1].make_move([4,3])
        game_state = pieces2[0].make_move([3,3])

        game_state = player1.end_turn()
        game_state = player2.end_turn()

        game_state = pieces1[0].make_move([2,2])
        game_state = pieces1[1].make_move([2,1])
        self.assertEqual(game_state.winner, 0)

    def test_entire_game(self):
        print("=====TESTING ENTIRE GAME=====")
        game_state = create_game(self.map.id)

        player1 = game_state.join_game(self.user1.id)[1]
        player2 = game_state.join_game(self.user2.id)[1]

        pieces = ["Berserker", "Ice Wizard"]
        pieces1 = player1.select_pieces(pieces)
        pieces = ["Cleric", "Soldier"]
        pieces2 = player2.select_pieces(pieces)
        self.assertEqual(len(Player.objects.get(user=self.user1.id).piece_set.all()), len(pieces))

        game_state = pieces1[0].make_move([1,1])
        game_state = pieces1[1].make_move([1,0])
        game_state = pieces2[1].make_move([4,3])
        game_state = pieces2[0].make_move([3,3])

        game_state = player1.end_turn()
        game_state = player2.end_turn()

        game_state = pieces1[0].make_move([2,2])
        game_state = pieces1[1].make_move([2,1])

        game_state = player1.end_turn()
        game_state = pieces2[0].make_move([2,3])
        game_state = pieces2[1].make_move([3,2])
        game_state = pieces2[0].attack_piece([2,2])
        game_state = player2.end_turn()
        pieces1[1].freeze_special([3,2])

        game_state = pieces1[0].attack_piece([2,3])
        game_state = player1.end_turn()
        game_state = pieces2[0].attack_piece([2,2])
        game_state = pieces2[0].make_move([2,2])
        game_state = player2.end_turn()
        game_state = pieces1[1].freeze_special([2,2])
        game_state = pieces1[1].make_move([2,0])
        game_state = player1.end_turn()
        game_state = pieces2[1].make_move([2,1])
        game_state = pieces2[1].attack_piece([2,0])
        self.assertEqual(game_state.winner, 1)

    def test_ice_wizard(self):
        print("=====TESTING ICE WIZARD=====")
        game_state = create_game(self.map.id)

        player1 = game_state.join_game(self.user1.id)[1]
        player2 = game_state.join_game(self.user2.id)[1]

        pieces = ["Berserker", "Ice Wizard"]
        pieces1 = player1.select_pieces(pieces)
        pieces = ["Ice Wizard", "Berserker"]
        pieces2 = player2.select_pieces(pieces)

        game_state = pieces1[0].make_move([1,1])
        game_state = pieces1[1].make_move([1,0])
        game_state = pieces2[1].make_move([4,3])
        game_state = pieces2[0].make_move([3,3])

        game_state = player1.end_turn()
        game_state = player2.end_turn()

        game_state = pieces1[0].make_move([2,2])
        game_state = pieces1[1].make_move([2,1])

        game_state = player1.end_turn()
        game_state = pieces2[0].make_move([2,3])
        game_state = pieces2[1].make_move([3,2])
        game_state = pieces2[0].freeze_special([3,2])
        game_state = player2.end_turn()

    def test_movement_barriers(self):
        print("=====TESTING MOVEMENT=====")
        game_state = create_game(self.map.id)

        player1 = game_state.join_game(self.user1.id)[1]
        player2 = game_state.join_game(self.user2.id)[1]

        pieces = ["Scout", "Soldier"]
        pieces1 = player1.select_pieces(pieces)
        pieces = ["Scout", "Soldier"]
        pieces2 = player2.select_pieces(pieces)

        game_state = pieces1[0].make_move([1,1])
        game_state = pieces1[1].make_move([1,0])
        game_state = pieces2[1].make_move([4,3])
        game_state = pieces2[0].make_move([3,3])

        game_state = player1.end_turn()
        game_state = player2.end_turn()

        with self.assertRaises(IllegalMoveError):
            game_state = pieces1[0].make_move([4,1])