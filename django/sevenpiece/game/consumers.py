from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
import logging

logging.basicConfig(level=logging.INFO)

class GameConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None

    def connect(self):
        logging.info("Connected!")
        self.room_name = f"{self.scope['url_route']['kwargs']['room']}"
        self.accept()
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,
        )

        self.send_json(
            {
                "type": "welcome_message",
                "message": "Hey there! You've successfully connected!",
            }
        )

    def disconnect(self, code):
        logging.info("Disconnected!")
        return super().disconnect(code)

    def game_state(self, event):
        logging.info(event)
        self.send_json(event)

    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "join_room":
            logging.info("succesfully joined {}".format(content["name"]))
        elif message_type == "move":
            logging.info("sending move info to {}".format(self.room_name))
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "game_state",
                    "message": content["action"] + " : " + self.room_name,
                },
            )
        else:
            logging.info("Uknown message")
        return super().receive_json(content, **kwargs)