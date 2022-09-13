from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from game.models import GameState
from game.game_logic import create_game

import logging

logging.basicConfig(level=logging.INFO)

class GameConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.current_game_state = None

    def connect(self):
        logging.info("Connected!")
        self.room_name = f"{self.scope['url_route']['kwargs']['game_id']}"
        # self.room_name = "test_room"
        logging.info(self.room_name)
        self.accept()
        logging.info(self.scope)
        self.user = self.scope["user"]
        self.scope["session"].save()
        self.session = self.scope["session"].session_key
        logging.info(self.session)
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,
        )
        async_to_sync(self.channel_layer.group_add)(
            self.session,
            self.channel_name,
        )
                

    def disconnect(self, code):
        logging.info("Disconnected!")
        return super().disconnect(code)

    def game_state(self, event):
        self.send_json(event)

    def error(self, event):
        self.send_json(event)
        
    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "create_game":
            self.current_game_state = create_game(self.session, content["map"])
            logging.info(str(self.current_game_state.session))
        elif message_type == "join_game":
            try:
                game = GameState.objects.get(session=content["session"])
                self.current_game_state = game.join_game(self.session)
                logging.info("Joined game")
            except:
                logging.info("Failed to join game")
                async_to_sync(self.channel_layer.group_send)(
                self.session,
                {
                    "type": "error",
                    "message": "Could not join game",
                },
                )
                return

        elif message_type == "end_turn":
            logging.info("End turn")
        elif message_type == "select_pieces":
            logging.info("selecting pieces")
        elif message_type == "move":
            logging.info("sending move info to {}".format(self.room_name))
            # make_move(content["selected_piece"], [content["target_x"],content["target_y"]], self.room_name)
        else:
            logging.info("Uknown message")
        logging.info("Sending to {}".format(self.room_name))
        async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "game_state",
                    "state": self.current_game_state.get_game_state(),
                },
            )
        return super().receive_json(content, **kwargs)