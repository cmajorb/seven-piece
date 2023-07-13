import random
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from game.simulate import simulation_setup, simulate
from game.models import GameState, Player, Piece, MapTemplate, Character
from game.game_logic import create_game
from game.serializers import MapSerializer, CharacterSerializer
import json
import logging
from channels.consumer import SyncConsumer
from django.contrib.auth.models import User
from datetime import datetime, timezone
from game.data.constants import TURN_LENGTH
from game.single_player import execute_turn

logging.basicConfig(level=logging.INFO)

class GameConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.current_game_state = None
        self.player = None
        self.opponent = None

    def connect(self):
        self.room_name = f"{self.scope['url_route']['kwargs']['game_id']}"
        self.accept()
        self.scope["session"].save()
        self.session_id = self.scope["session"].session_key
        logging.info("{} has connected to room {}".format(self.session_id,self.room_name))
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

    def get_characters(self, event):
        self.send_json(event)

    def get_specials(self, event):
        self.send_json(event)

    def error(self, event):
        self.send_json(event)

    def timer(self, event):
        self.send_json(event)
        
    def receive_json(self, content, **kwargs):
        if self.player:
            self.player.refresh_from_db() 
            self.current_game_state.refresh_from_db()
        message_type = content["type"]
        error = ""
        # if message_type == "check_timer":
        #     if not self.current_game_state.single_player:
        #         if (datetime.now(timezone.utc) - self.current_game_state.start_turn_time).seconds > TURN_LENGTH:
        #             error = "Timer has expired"
        #             try:
        #                 self.current_game_state.end_turn_current_player()
        #             except Exception as e:
        #                 error += f", Failed to end turn from timer: {e}"
        #         else:
        #             async_to_sync(self.channel_layer.group_send)(
        #             self.room_name,
        #             {
        #                 "type": "timer",
        #                 "time": TURN_LENGTH - (datetime.now(timezone.utc) - self.current_game_state.start_turn_time).seconds,
        #             },
        #             )
        #             return
        if message_type == "get_characters":
            characters = Character.objects.all()
            serializer = CharacterSerializer(characters, many=True)
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "get_characters",
                    "characters": serializer.data,
                },
            )
        elif message_type == "get_specials":
            specials = json.loads((open('sevenpiece/game/data/specials.json')).read())
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "get_specials",
                    "specials": specials["specials"],
                },
            )
        elif message_type == "join_game":
            try:
                game = GameState.objects.get(session=content["session"])
                if game.single_player:
                    self.current_game_state, self.player, self.opponent = game.join_game(self.scope["user_id"])
                else:
                    self.current_game_state, self.player = game.join_game(self.scope["user_id"])
                self.send(json.dumps({'type': "connect", 'player': self.player.get_info()}))
            except Exception as e:
                error = "Failed to join game: {}".format(e)
                logging.info(error)
                async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "error",
                    "message": error,
                },
                )
                return

        elif message_type == "end_turn":
            try:
                self.player.end_turn()
                if self.current_game_state.single_player:
                    async_to_sync(self.channel_layer.send)('background-tasks', {'type': 'ai_move', 'game_session':str(self.current_game_state.session), 'room_name' : self.room_name})
            except Exception as e:
                error = f"Failed to end turn: {e}"
        elif message_type == "select_pieces":
            try:
                self.player.select_pieces(json.loads(content["pieces"]))
                if self.current_game_state.single_player:
                    characters = list(Character.objects.exclude(name="Ice Wizard").values_list('name', flat=True))
                    self.opponent.select_pieces(random.sample(characters, 3))
                    async_to_sync(self.channel_layer.send)('background-tasks', {'type': 'ai_move', 'game_session':str(self.current_game_state.session), 'room_name' : self.room_name})

            except Exception as e:
                error = f"Failed to select pieces: {e}"
        elif message_type == "action":
            #Make sure it belongs to the user
            try:
                piece = Piece.objects.get(player=self.player, id=content["piece"])
                piece = piece.cast_piece()
            except:
                error = "Piece does not exist"
            
            # NOTE: Disabled timer for now, since it was making it impossible to do anything!
            # if not self.current_game_state.single_player:
            #     if (datetime.now(timezone.utc) - self.current_game_state.start_turn_time).seconds > TURN_LENGTH:
            #         error = "Timer has expired"
            #         try:
            #             self.current_game_state.end_turn_current_player()
            #         except Exception as e:
            #             error += f", Failed to end turn from timer on action: {e}"

            if content["action_type"] == "move":
                try:
                    piece.make_move([content["location_x"], content["location_y"]])
                except Exception as e:
                    error = f"Failed to move piece: {e}"
            elif content["action_type"] == "attack":
                try:
                    piece.attack_piece([content["location_x"], content["location_y"]])
                except Exception as e:
                    error = f"Failed to attack piece: {e}"
            elif content["action_type"] == "freeze":
                try:
                    piece.freeze_special([content["location_x"], content["location_y"]])
                except Exception as e:
                    error = f"Failed to freeze piece: {e}"
        else:
            error = "Unknown command"
        if error != "":
            logging.error(error)
            async_to_sync(self.channel_layer.group_send)(
                    self.room_name,
                    {
                        "type": "error",
                        "message": error,
                    },
                )
        self.current_game_state.refresh_from_db()
        async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "game_state",
                    "state": self.current_game_state.get_game_state(),
                },
            )

        return super().receive_json(content, **kwargs)


class MenuConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None

    def connect(self):
        logging.info("Connected to menu!")

        self.scope['user_id'] = self.scope['url_route']['kwargs']['user_id']
        logging.info(f"USER ID: {self.scope['user_id']}")

        self.scope["session"].save()
        self.room_name = self.scope["session"].session_key
        logging.info(f"ROOM: {self.room_name}")
        self.accept()

        self.player, created = Player.objects.get_or_create(user=User.objects.get(id=self.scope['user_id']))
        self.player.state = "IDLE"
        self.player.session = self.room_name
        self.player.save(update_fields=['session','state'])
        logging.info(f"PLAYER: {self.player}")

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
        
    def searching(self, event):
        self.send_json(event)

    def get_maps(self, event):
        self.send_json(event)

    def get_simulation(self, event):
        self.send_json(event)

    def error(self, event):
        self.send_json(event)
        
    def receive_json(self, content, **kwargs):
        message_type = content["type"]

        if message_type == "find_match":
            try:
                opponent = Player.objects.filter(state="MATCHING").first()
                if opponent:
                    opponent.state = "PLAYING"
                    opponent.save(update_fields=['state'])
                    self.player.state = "PLAYING"
                    self.player.save(update_fields=['state'])
                    current_game_state = create_game(random.choice(MapTemplate.objects.all()).id)
                    async_to_sync(self.channel_layer.group_send)(
                        self.room_name,
                        {
                            "type": "start_game",
                            "session_id": str(current_game_state.session),
                        },
                    )
                    async_to_sync(self.channel_layer.group_send)(
                        opponent.session,
                        {
                            "type": "start_game",
                            "session_id": str(current_game_state.session),
                        },
                    )
                else:
                    self.player.state = "MATCHING"
                    self.player.save(update_fields=['state'])
                    async_to_sync(self.channel_layer.group_send)(
                        self.room_name,
                        {
                            "type": "searching",
                        },
                    )
            except Exception as e:
                logging.error("Failed to create game: {}".format(e))
                async_to_sync(self.channel_layer.group_send)(
                    self.room_name,
                    {
                        "type": "error",
                        "message": f"Could not create game from menu: {e}",
                    },
                )
        elif message_type == "get_maps":            
            maps = MapTemplate.objects.all()
            serializer = MapSerializer(maps, many=True)
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "get_maps",
                    "maps": serializer.data,
                },
            )
        elif message_type == "single_player":
            current_game_state = create_game(random.choice(MapTemplate.objects.all()).id, single_player=True)
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "start_game",
                    "session_id": str(current_game_state.session),
                },
            )
        elif message_type == "simulate":
            logging.info("Running simulation")
            simulated_game_state = create_game(2)
            simulated_game_state = simulation_setup(simulated_game_state)
            session = str(simulated_game_state.session)
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "get_simulation",
                    "session": session,
                },
            )
            async_to_sync(self.channel_layer.send)('background-tasks', {'type': 'simulate', 'game_session':session})
        return super().receive_json(content, **kwargs)

class BackgroundTaskConsumer(SyncConsumer):
    def simulate(self, message):
        game = GameState.objects.get(session=message['game_session'])
        simulate(game)

    def ai_move(self, message):
        game = GameState.objects.get(session=message['game_session'])
        computer = Player.objects.filter(game=game,number=0).first()
        execute_turn(computer,message['room_name'])
        computer.end_turn()
        game.refresh_from_db() 
        async_to_sync(self.channel_layer.group_send)(
                message['room_name'],
                {
                    "type": "game_state",
                    "state": game.get_game_state(),
                },
            )