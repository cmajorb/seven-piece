from game.models import Character, Map, ColorScheme, Player, Piece, IceWizard, MapTemplate
import json
from game.game_logic import create_game
from game.exceptions import JoinGameError
import logging
import time
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logging.basicConfig(level=logging.INFO)

def simulate():
    sleep_time = 2.5
    session0 = "123"
    session1 = "789"
    game_state = create_game(2)
    logging.info("Simulating: {}".format(game_state))

    game_state.join_game(session0)
    game_state.join_game(session1)
    player1 = Player.objects.get(session=session0, game=game_state)
    player2 = Player.objects.get(session=session1, game=game_state)

    pieces = ["Berserker", "Ice Wizard"]
    pieces1 = player1.select_pieces(pieces)
    pieces = ["Berserker", "Soldier"]
    pieces2 = player2.select_pieces(pieces)

    game_state = pieces1[0].make_move([1,1])
    time.sleep(sleep_time)
    print(game_state.get_game_summary())
    game_state = pieces1[1].make_move([1,0])
    time.sleep(sleep_time)
    print(game_state.get_game_summary()) 
    game_state = pieces2[0].make_move([3,3])
    time.sleep(sleep_time)
    print(game_state.get_game_summary())
    game_state = pieces2[1].make_move([4,3])
    time.sleep(sleep_time)
    print(game_state.get_game_summary())

    game_state = player1.end_turn()

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        str(game_state.session),
        {"type": "game_state",
                        "state": game_state.get_game_state()}
    )

    logging.info(game_state.get_game_summary())
    game_state = pieces1[0].make_move([2,2])
    time.sleep(sleep_time)
    print(game_state.get_game_summary())
    game_state = pieces1[1].make_move([2,1])
    time.sleep(sleep_time)
    print(game_state.get_game_summary())

    game_state = player1.end_turn()
    logging.info(game_state.get_game_summary())
    print(game_state.get_game_summary())
    time.sleep(sleep_time)
    game_state = pieces2[0].make_move([2,3])
    time.sleep(sleep_time)
    game_state = pieces2[1].make_move([3,2])
    print(game_state.get_game_summary())
    time.sleep(sleep_time)
    game_state = pieces2[0].attack_piece([2,2])
    time.sleep(sleep_time)
    print(game_state.get_game_summary())
    game_state = player2.end_turn()
    logging.info(game_state.get_game_summary())
    print(game_state.get_game_summary())
    time.sleep(sleep_time)
    pieces1[1].freeze_special([2,3])
    time.sleep(sleep_time)
    print(game_state.get_game_state())