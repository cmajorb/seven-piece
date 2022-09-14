from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from game.models import GameState, Player, Piece
from game.game_logic import create_game
import json
import logging

logging.basicConfig(level=logging.INFO)

class GameConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.current_game_state = None
        self.player = None

    def connect(self):
        logging.info("Connected!")
        self.room_name = f"{self.scope['url_route']['kwargs']['game_id']}"
        # self.room_name = "test_room"
        logging.info(self.room_name)
        self.accept()
        logging.info(self.scope)
        self.user = self.scope["user"]
        self.scope["session"].save()
        self.session_id = self.scope["session"].session_key
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,
        )
                

    def disconnect(self, code):
        logging.info("Disconnected!")
        async_to_sync(self.channel_layer.group_discard)(self.room_name, self.channel_name)
        return super().disconnect(code)

    def game_state(self, event):
        self.send_json(event)

    def error(self, event):
        self.send_json(event)
        
    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        error = ""
        if message_type == "join_game":
            try:
                game = GameState.objects.get(session=content["session"])
                self.current_game_state = game.join_game(self.session_id)
                self.player = Player.objects.get(session=self.session_id, game=self.current_game_state)
                logging.info("Joined game")
            except:
                logging.info("Failed to join game")
                async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "error",
                    "message": "Could not join game",
                },
                )
                return

        elif message_type == "end_turn":
            logging.info("End turn")
            try:
                self.player.end_turn()
            except:
                error = "Failed to end turn"
        elif message_type == "select_pieces":
            logging.info("selecting pieces")
            try:
                self.player.select_pieces(json.loads(content["pieces"]))
            except:
                error = "Failed to select pieces"
        elif message_type == "action":
            #Make sure it belongs to the user
            try:
                piece = Piece.objects.get(player=self.player, id=content["piece"])
            except:
                error = "Piece does not exist"
            if content["action_type"] == "move":
                try:
                    piece.make_move([content["location_x"], content["location_y"]])
                except:
                    error = "Failed to move piece"
            elif content["action_type"] == "attack":
                try:
                    piece.attack_piece([content["location_x"], content["location_y"]])
                except:
                    error = "Failed to attack piece"
        else:
            error = "Unknown command"
        if error == "":
            async_to_sync(self.channel_layer.group_send)(
                    self.room_name,
                    {
                        "type": "game_state",
                        "state": self.current_game_state.get_game_state(),
                    },
                )
        else:
            logging.error(error)
            async_to_sync(self.channel_layer.group_send)(
                    self.room_name,
                    {
                        "type": "error",
                        "message": error,
                    },
                )
        return super().receive_json(content, **kwargs)


class MenuConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None

    def connect(self):
        logging.info("Connected to menu!")
        self.scope["session"].save()
        self.room_name = self.scope["session"].session_key
        logging.info(self.room_name)
        self.accept()
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,
        )
                
    def disconnect(self, code):
        logging.info("Disconnected from menu!")
        async_to_sync(self.channel_layer.group_discard)(self.room_name, self.channel_name)
        return super().disconnect(code)

    def start_game(self, event):
        self.send_json(event)

    def error(self, event):
        self.send_json(event)
        
    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "create_game":            
            try:
                current_game_state = create_game(content["map"])
                logging.info(str(current_game_state.session))
                async_to_sync(self.channel_layer.group_send)(
                    self.room_name,
                    {
                        "type": "start_game",
                        "session_id": str(current_game_state.session),
                    },
                )
            except:
                async_to_sync(self.channel_layer.group_send)(
                    self.room_name,
                    {
                        "type": "error",
                        "message": "Could not create game from menu",
                    },
                )
        return super().receive_json(content, **kwargs)