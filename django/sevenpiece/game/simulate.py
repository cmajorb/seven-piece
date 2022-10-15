from game.models import GameState, Character, Map, ColorScheme, Player, Piece, IceWizard, MapTemplate
import json
from game.game_logic import create_game
from game.exceptions import JoinGameError
import logging
import time
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logging.basicConfig(level=logging.INFO)
sleep_time = 2
channel_layer = get_channel_layer()

def step(game_state):
    async_to_sync(channel_layer.group_send)(
        str(game_state.session),
        {"type": "game_state",
        "state": game_state.get_game_state()}
    )
    time.sleep(sleep_time)
    logging.info(game_state.get_game_summary()) 

def simulation_setup(game_state):
    session0 = "123"
    session1 = "789"
    logging.info("Setting up simulation: {}".format(game_state))

    game_state.join_game(session0)
    game_state.join_game(session1)
    return game_state

def simulate(game_state):
    logging.info("Running simulation: {}".format(game_state))
    
    players = game_state.player_set.all()
    player1 = players[0]
    player2 = players[1]

    pieces = ["Berserker", "Ice Wizard"]
    pieces1 = player1.select_pieces(pieces)
    pieces = ["Cleric", "Soldier"]
    pieces2 = player2.select_pieces(pieces)
    # step(game_state)
    game_state = pieces1[0].make_move([1,1])
    # step(game_state)
    game_state = pieces1[1].make_move([1,0])
    # step(game_state)
    game_state = pieces2[1].make_move([4,3])
    # step(game_state)
    game_state = pieces2[0].make_move([3,3])
    # step(game_state)
    game_state = player1.end_turn()
    game_state = player2.end_turn()
    step(game_state)
    game_state = pieces1[0].make_move([2,2])
    step(game_state)
    game_state = pieces1[1].make_move([2,1])
    step(game_state)
    game_state = player1.end_turn()
    step(game_state)
    game_state = pieces2[0].make_move([2,3])
    step(game_state)
    game_state = pieces2[1].make_move([3,2])
    step(game_state)
    game_state = pieces2[0].attack_piece([2,2])
    step(game_state)
    game_state = player2.end_turn()
    step(game_state)
    pieces1[1].freeze_special([2,3])
    step(game_state)