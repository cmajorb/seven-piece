from datetime import datetime, timezone
import uuid
from django.db import models
import json
from game.data.constants import MAP_DEFINITION
from game.exceptions import IllegalMoveError, IllegalPieceSelection
import logging
from django.db.models import Sum
import math
from django.contrib.auth.models import User


logging.basicConfig(level=logging.INFO)

class ColorScheme(models.Model):
    name = models.CharField(max_length=150, null=False, unique=False)
    scheme = models.JSONField()
    max_player_size = models.IntegerField()
    def __str__(self):
        return self.name + " (" + str(self.max_player_size) + ")"

class Map(models.Model):
    name = models.CharField(max_length=150, null=False, unique=False)
    data = models.JSONField()
    player_size = models.IntegerField()
    num_characters = models.IntegerField()
    color_scheme = models.ForeignKey(ColorScheme, on_delete=models.CASCADE, null=True)
    score_to_win = models.IntegerField(default = 5)
    def __str__(self):
        return self.name + " (" + str(self.player_size) + ")"

class MapTemplate(models.Model):
    name = models.CharField(max_length=150, null=False, unique=False)
    data = models.JSONField()
    player_size = models.IntegerField()
    num_characters = models.IntegerField()
    color_scheme = models.ForeignKey(ColorScheme, on_delete=models.CASCADE, null=True)
    score_to_win = models.IntegerField(default = 5)
    def __str__(self):
        return self.name + " (" + str(self.player_size) + ")"

class Character(models.Model):
    name = models.CharField(max_length=150, null=False, unique=False)
    health = models.IntegerField(default=1)
    attack = models.IntegerField(default=1)
    speed = models.IntegerField(default=1)
    special = models.CharField(max_length=150, default="None")
    image = models.CharField(max_length=150)
    description = models.CharField(max_length=500)
    attack_range_min = models.IntegerField(default=1)
    attack_range_max = models.IntegerField(default=1)
    special_range_min = models.IntegerField(default=0)
    special_range_max = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name + " ({})".format(str(self.id))



class GameState(models.Model):
    session = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    map = models.ForeignKey(Map, on_delete=models.CASCADE, null=True)
    state = models.CharField(max_length=50, default='WAITING', choices=[('WAITING', 'Waiting for players'), ('SELECTING', 'Selecting pieces'), ('PLACING', 'Placing pieces'), ('PLAYING', 'Game in progress'), ('FINISHED', 'Game Over')])
    turn_count = models.IntegerField(default=0)
    objectives = models.CharField(max_length=50, default="")
    winner  = models.IntegerField(default=-1)
    created = models.DateTimeField(default=datetime.now)
    ended = models.DateTimeField(blank=True, null=True)
    start_turn_time = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return str(self.session)

    def get_piece_by_location(self, location):
        return self.piece_set.all().filter(location_x=location[0], location_y=location[1]).first()

    def init_game(self):
        logging.info("[{}] Starting PLACING phase".format(self))
        self.state = "PLACING"
        for piece in self.piece_set.all():
            if piece.character.name == "Cleric":
                piece.cast_piece().update_shields(True)
            piece.health = piece.character.health
            piece.health_start = piece.character.health #plus buffer
            piece.speed_start = piece.character.speed #plus buffer
            piece.attack_start = piece.character.attack #plus buffer
            piece.save(update_fields=['health','health_start','speed_start','attack_start'])
            piece.reset_stats()
        self.save(update_fields=['state'])

    def start_game(self):
        logging.info("[{}] Starting PLAYING phase".format(self))
        self.state = "PLAYING"
        objectives = []
        for val in sum(self.map.data["data"], []):
            if val == MAP_DEFINITION['objective']:
                objectives.append("-1")
        self.objectives = ",".join(objectives)
        self.start_turn_time = datetime.now(timezone.utc)
        self.save(update_fields=['objectives','state','start_turn_time'])

    def join_game(self, user_id):
        current_player, created = Player.objects.get_or_create(user=User.objects.get(id=user_id))
        if current_player.game == self:
            logging.info("[{}] {} has rejoined the game".format(self, current_player))
            return [self, current_player]
        num_of_players = self.player_set.all().count()
        if num_of_players >= self.map.player_size:
            logging.info("[{}] {} has joined as a spectator".format(self, current_player))
            return [self, current_player]
        current_player.game = self
        current_player.number = num_of_players
        current_player.save(update_fields=['game','number'])
        logging.info("[{}] {} has joined the game ({}/{} players)".format(self, current_player, num_of_players + 1, self.map.player_size))
        if num_of_players + 1 == self.map.player_size:
            logging.info("[{}] Starting SELECTING phase".format(self))
            self.state = "SELECTING"
            self.save(update_fields=['state'])
            self.reset_players()
        return [self, current_player]

    def reset_players(self):
        for player in self.player_set.all():
            player.ready = False
            player.score = 0
            player.save(update_fields=['ready','score'])
            for piece in player.piece_set.all():
                piece.game = None
                piece.location_x = None
                piece.location_y = None
                piece.save(update_fields=['game','location_x','location_y'])

    def calculate_stats(self, winner):
        for player in self.player_set.all():
            player.stats_games_played += 1
            if player == winner:
                player.stats_wins += 1
            player.save(update_fields=['stats_games_played','stats_wins'])
            for piece in player.piece_set.all().filter(game=self):
                piece.stats_games_played += 1
                if player == winner:
                    piece.stats_wins += 1
                piece.save(update_fields=['stats_games_played','stats_wins'])

    def end_game(self, winner):
        logging.info("[{}] {} has won the game".format(self, winner))
        self.state = "FINISHED"
        self.winner = winner.number
        self.ended = datetime.now(timezone.utc)
        self.save(update_fields=['state','winner','ended'])
        self.calculate_stats(winner)
        
    def get_game_state(state):
        if state == None:
            return None
        dictionary = {}
        dictionary["session"] = str(state.session)
        dictionary["state"] = state.state
        dictionary["map"] = state.map.data
        dictionary["map"]["color_scheme"] = state.map.color_scheme.scheme
        dictionary["turn_count"] = state.turn_count
        dictionary["objectives"] = state.objectives.split(",")
        dictionary["pieces"] = []
        dictionary["allowed_pieces"] = state.map.num_characters
        dictionary["players"] = []
        dictionary["score_to_win"] = state.map.score_to_win
        dictionary["winner"] = state.winner
        for piece in state.piece_set.all():
            dictionary["pieces"].append(piece.get_info())
        for player in state.player_set.all().order_by('number'):
            dictionary["players"].append(player.get_info())

        return json.dumps(dictionary, indent = 4)

    def get_game_summary(state):
        if state == None:
            return None
        dictionary = {}
        dictionary["score"] = ""
        pieces = []
        for piece in state.piece_set.all():
            pieces.append("Name: {}({}:{}), Speed: {}, Attack: {}, Health: {}, Location: ({}, {})".format(piece.character.name, piece.player.user.id, piece.id, piece.speed, piece.attack, piece.health, piece.location_x, piece.location_y))
        dictionary["pieces"] = pieces
        for player in state.player_set.all():
            dictionary["score"] += "{} ({}), ".format(player.id, player.score)
        return dictionary

class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    session = models.CharField(max_length=50, null=False, default="")
    game = models.ForeignKey(GameState, on_delete=models.CASCADE, null=True)
    score = models.IntegerField(default=0)
    number = models.IntegerField(default=-1)
    state = models.CharField(max_length=50, default='IDLE', choices=[('IDLE', 'Not playing'), ('MATCHING', 'Waiting to join a match'), ('PLAYING', 'Currently playing a game')])
    ready = models.BooleanField(default=False)

    stats_wins = models.IntegerField(default=0)
    stats_games_played = models.IntegerField(default=0)

    def __str__(self):
        return "Player {} [{}]".format(self.number, self.user.username)
    
    
    def get_info(self):
        dictionary = {}
        if self.game is not None: 
            current_scores = self.game.objectives.split(",")
            dictionary["score"] = {}
            dictionary["score"]["objectives"] = current_scores.count(str(self.number))
            dictionary["score"]["kills"] = self.score
            dictionary["score"]["total"] = self.score + current_scores.count(str(self.number))
            dictionary["is_turn"] = self.is_current_turn()
        else:
            dictionary["is_turn"] = False

        dictionary["number"] = self.number
        dictionary["user"] = self.user.username
        dictionary["ready"] = self.ready
        return dictionary

    def is_current_turn(self):
        return self.game.turn_count % self.game.map.player_size == self.number

    def select_pieces(self, pieces):
        all_pieces = []
        if self.game.state != "SELECTING":
            raise IllegalPieceSelection("Must be in the SELECTING state to select pieces")
        if len(pieces) != self.game.map.num_characters:
            raise IllegalPieceSelection("Must select {} pieces".format(len(pieces)))
        if self.piece_set.all().filter(game=self.game).count() != 0:
            raise IllegalPieceSelection("Pieces have already been selected")
        logging.info("[{}] {} has selected {}".format(self.game, self, ", ".join(pieces)))
        for i, piece in enumerate(pieces):
            start_tile = self.game.map.data["start_tiles"][self.number][i]
            character = Character.objects.get(name=piece)
            new_piece, created = Piece.objects.get_or_create(character=character, player=self)
            new_piece.game = self.game
            new_piece.save(update_fields=['game'])
            new_piece = new_piece.cast_piece()
            new_piece.make_move([start_tile[0],start_tile[1]])
            all_pieces.append(new_piece)
        if self.game.piece_set.all().count() == self.game.map.num_characters * self.game.map.player_size:
            self.game.init_game()
        return all_pieces

    def end_turn(self):
        #Check to make sure all pieces have moved
        self.game.refresh_from_db()
        if self.game.state == "PLACING":
            logging.info("[{}] {} is ready to play".format(self.game, self))
            self.ready = True
            self.save(update_fields=['ready'])
            if self.game.player_set.filter(ready=True).count() == self.game.map.player_size:
                self.game.start_game()
            return self.game
        if self.game.state != "PLAYING":
            raise IllegalMoveError("Must be in the PLAYING state to end turn")
        if self.is_current_turn():
            self.game.start_turn_time = datetime.now(timezone.utc)
            current_scores = self.game.objectives.split(",")
            for player in self.game.player_set.all():
                if player.score + current_scores.count(str(player.number)) >= self.game.map.score_to_win:
                    self.game.end_game(player)
            self.game.turn_count = self.game.turn_count + 1
            logging.info("[{}] {} has ended their turn".format(self.game, self))
            self.game.save(update_fields=['turn_count','start_turn_time'])
            for piece in self.game.piece_set.all().filter(player = self):
                piece.reset_stats()
        else:
            raise IllegalMoveError("Must be current turn to end turn")
        self.game.refresh_from_db()
        return self.game


class Piece(models.Model):
    character = models.ForeignKey(Character, on_delete=models.CASCADE, null=True)
    location_x = models.IntegerField(null=True)
    location_y = models.IntegerField(null=True)
    health = models.IntegerField(default=0)
    shield = models.BooleanField(default=False)
    speed = models.IntegerField(default=0)
    attack = models.IntegerField(default=0)
    health_start = models.IntegerField(default=0)
    speed_start = models.IntegerField(default=0)
    attack_start = models.IntegerField(default=0)
    game = models.ForeignKey(GameState, on_delete=models.CASCADE, null=True)
    special = models.IntegerField(default=0)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=False)
    point_value = models.IntegerField(default=1)
    state = models.CharField(max_length=50, default='normal')

    stats_movements = models.IntegerField(default=0)
    stats_damage_dealt = models.IntegerField(default=0)
    stats_damage_taken = models.IntegerField(default=0)
    stats_wins = models.IntegerField(default=0)
    stats_games_played = models.IntegerField(default=0)
    stats_kills = models.IntegerField(default=0)
    stats_objectives_captured = models.IntegerField(default=0)
    stats_deaths = models.IntegerField(default=0)

    def __str__(self):
        return "{} ({})".format(self.character.name, self.id)

    def cast_piece(self):
        if self.character.name == "Ice Wizard":
            return IceWizard.objects.get(id=self.id)
        elif self.character.name == "Scout":
            return Scout.objects.get(id=self.id)
        elif self.character.name == "Archer":
            return Archer.objects.get(id=self.id)
        elif self.character.name == "Cleric":
            return Cleric.objects.get(id=self.id)
        elif self.character.name == "Werewolf":
            return Werewolf.objects.get(id=self.id) 
        return self

    def reset_stats(self):
        self.speed = self.character.speed
        self.attack = self.attack_start
        self.state = "normal"
        if self.character.special != "None":
            self.special = 1
        self.save(update_fields=['speed','attack','special','state'])

    def freeze(self):
        self.speed = 0
        self.attack = 0
        self.special = 0
        self.state = "frozen"
        self.save(update_fields=['speed','attack','special','state'])
        return self
        #Change image

    def get_info(piece):
        if piece == None:
            return None
        dictionary = {}
        dictionary["current_stats"] = {}
        dictionary["default_stats"] = {}
        dictionary["start_stats"] = {}
        dictionary["name"] = piece.character.name
        dictionary["player"] = piece.player.number
        dictionary["description"] = piece.character.description
        dictionary["location"] = [piece.location_x, piece.location_y]
        dictionary["image"] = piece.character.image
        dictionary["id"] = piece.id
        dictionary["state"] = piece.state
        dictionary["shield"] = piece.shield

        dictionary["current_stats"]["health"] = piece.health
        dictionary["current_stats"]["speed"] = piece.speed
        dictionary["current_stats"]["attack"] = piece.attack
        dictionary["current_stats"]["special"] = piece.special
        dictionary["current_stats"]["attack_range_min"] = piece.character.attack_range_min
        dictionary["current_stats"]["attack_range_max"] = piece.character.attack_range_max    
        dictionary["current_stats"]["special_range_min"] = piece.character.special_range_min
        dictionary["current_stats"]["special_range_max"] = piece.character.special_range_max

        dictionary["start_stats"]["health"] = piece.health_start
        dictionary["start_stats"]["speed"] = piece.speed_start
        dictionary["start_stats"]["attack"] = piece.attack_start
        dictionary["start_stats"]["special"] = piece.special
        dictionary["start_stats"]["attack_range_min"] = piece.character.attack_range_min
        dictionary["start_stats"]["attack_range_max"] = piece.character.attack_range_max
        dictionary["start_stats"]["special_range_min"] = piece.character.special_range_min
        dictionary["start_stats"]["special_range_max"] = piece.character.special_range_max

        dictionary["default_stats"]["health"] = piece.character.health
        dictionary["default_stats"]["speed"] = piece.character.speed
        dictionary["default_stats"]["attack"] = piece.character.attack
        dictionary["default_stats"]["special"] = piece.special
        dictionary["default_stats"]["attack_range_min"] = piece.character.attack_range_min
        dictionary["default_stats"]["attack_range_max"] = piece.character.attack_range_max
        dictionary["default_stats"]["special_range_min"] = piece.character.special_range_min
        dictionary["default_stats"]["special_range_max"] = piece.character.special_range_max
        
        return dictionary
    
    def take_damage(self, damage):
        if self.shield == True:
            self.shield = False
            self.save(update_fields=['shield'])
            return self
        self.health -= damage
        self.stats_damage_taken += damage
        if self.health < 0:
            self.stats_deaths += 1
            self.health = 0
        self.save(update_fields=['health','stats_damage_taken','stats_deaths'])
        return self

    def finish_attack(self):
        self.attack = 0
        self.save(update_fields=['attack'])

    def attack_piece(self, location):
        #check to make sure it isn't on their team
        self.refresh_from_db()
        if self.game.state != "PLAYING":
            raise IllegalMoveError("Must be in the PLAYING state to attack")
        if not self.player.is_current_turn():
            raise IllegalMoveError("Must be current turn to attack")
        if self.attack == 0:
            raise IllegalMoveError("{} has no available attack".format(self))
        if not self.is_range_valid(location, self.character.attack_range_min, self.character.attack_range_max):
            raise IllegalMoveError("The target is outside of range")
        target_piece = self.game.get_piece_by_location(location)
        if target_piece:
            health_before = target_piece.health
            target_piece = target_piece.cast_piece()
            target_piece = target_piece.take_damage(self.attack)
            health_after = target_piece.health
            logging.info("[{}] {} attacked {} with {} and dealt {} damage".format(self.game, self.player, target_piece, self, health_before - health_after))
            self.stats_damage_dealt += self.attack
            self.save(update_fields=['stats_damage_dealt','stats_kills'])
            if target_piece.player.piece_set.all().filter(game=self.game).aggregate(Sum('health'))['health__sum'] == 0:
                logging.info("[{}] All of the pieces of {} have been killed".format(self.game, target_piece.player))
                self.game.end_game(self.player)
        else:
            raise IllegalMoveError("No piece could be found at that location")
        if target_piece.health <= 0:
            points = target_piece.remove_piece()
            self.player.score += points
            self.player.save(update_fields=['score'])
            self.stats_kills += 1
            logging.info("[{}] {} killed {} with {}".format(self.game, self.player, target_piece, self))
        self.finish_attack()
        self.game.refresh_from_db()
        return self.game

    def make_move(self, location):
        self.refresh_from_db()
        self.game.refresh_from_db()
        if self.game.state == "PLACING" or self.game.state == "SELECTING":
            self.place_piece(location)
            self.game.refresh_from_db()
            return self.game
        if self.game.state != "PLAYING":
            raise IllegalMoveError("Must be in the PLAYING state to move")
        if not self.player.is_current_turn():
            raise IllegalMoveError("Must be current turn to move")
        if not self.is_range_valid(location, 0, self.speed):
            raise IllegalMoveError("The movement is outside of range")
        if self.game.map.data["data"][location[0]][location[1]] not in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']]:
            raise IllegalMoveError("This tile is not free")
        self.move_piece(location)
        self.game.refresh_from_db()
        return self.game

    def capture_objective(self, location):
        self.stats_objectives_captured += 1
        self.save(update_fields=['stats_objectives_captured'])
        flat_board = sum(self.game.map.data["data"], [])
        current_scores = self.game.objectives.split(",")
        flat_location = location[0] * len(self.game.map.data["data"][0]) + location[1]
        score_location = 0
        logging.info("[{}] {} captured an objective at [{},{}] with {}".format(self.game, self.player, location[0], location[1], self))
        for i, val in enumerate(flat_board):
            if i == flat_location:
                break
            if val & MAP_DEFINITION['objective'] == MAP_DEFINITION['objective']:
                score_location += 1
        current_scores[score_location] = str(self.player.number)
        if self.player.score + current_scores.count(str(self.player.number)) == self.game.map.score_to_win:
            self.game.end_game(self.player)

        self.game.objectives = ",".join(current_scores)
        self.game.save(update_fields=['objectives'])

    def move_piece(self, location):
        previous_x = self.location_x
        previous_y = self.location_y
        self.location_x = location[0]
        self.location_y = location[1]
        self.speed = 0
        self.stats_movements += max(abs(previous_x - self.location_x), abs(previous_y - self.location_y))
        self.save(update_fields=['location_x','location_y','speed','stats_movements'])
        board = self.game.map.data["data"]
        logging.info("[{}] {} moved {} from [{},{}] to [{},{}]".format(self.game, self.player, self, previous_x, previous_y, location[0], location[1]))
        if board[location[0]][location[1]] == MAP_DEFINITION['objective']:
            self.capture_objective(location)
        board[previous_x][previous_y] &=  ~MAP_DEFINITION['player']
        board[location[0]][location[1]] |=  MAP_DEFINITION['player']
        self.game.map.data["data"] = board
        self.game.map.save(update_fields=['data'])

    def move_placed_piece(self, location):
        previous_x = self.location_x
        previous_y = self.location_y
        self.location_x = location[0]
        self.location_y = location[1]
        self.save(update_fields=['location_x','location_y'])

        board = self.game.map.data["data"]
        if previous_x != None:
            board[previous_x][previous_y] &=  ~MAP_DEFINITION['player']
        board[location[0]][location[1]] |=  MAP_DEFINITION['player']
        self.game.map.data["data"] = board
        self.game.map.save(update_fields=['data'])

    def place_piece(self, location):
        logging.info("[{}] {} placed {} at {}".format(self.game, self.player, self, location))
        valid_tiles = self.game.map.data["start_tiles"][self.player.number]
        if location in valid_tiles and self.game.map.data["data"][location[0]][location[1]] == MAP_DEFINITION['normal']:
            self.move_placed_piece(location)
        else:
            raise IllegalMoveError("Location must be a start tile")

    def is_range_valid(self, location, range_min, range_max):
        map = self.game.map.data["data"]
        map_length_x = len(map)
        map_length_y = len(map[0])
        x_diff =  abs(location[0] - self.location_x)
        y_diff =  abs(location[1] - self.location_y)
        x_sign = int(math.copysign(1,location[0] - self.location_x))
        y_sign = int(math.copysign(1,location[1] - self.location_y))
        if location[0] < map_length_x and location[1] < map_length_y and location[0] >= 0 and location[1] >= 0: 
            if self.location_x == location[0] and y_diff <= range_max and y_diff >= range_min:
                for i in range(1,y_diff):
                    if map[self.location_x][self.location_y + y_sign * i] not in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']]:
                        return False
                return True
            elif self.location_y == location[1] and x_diff <= range_max and x_diff >= range_min:
                for i in range(1,x_diff):
                    if map[self.location_x + x_sign * i][self.location_y] not in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']]:
                        return False
                return True
            elif x_diff == y_diff and x_diff <= range_max and x_diff >= range_min:
                for i in range(1,x_diff):
                    if map[self.location_x + x_sign * i][self.location_y + y_sign * i] not in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']]:
                        return False
                return True
        return False
        
    def remove_piece(self):
        self.health = 0
        point_value = self.point_value
        self.game.map.data["data"][self.location_x][self.location_y] &=  ~MAP_DEFINITION['player']
        self.game.map.save(update_fields=['data'])
        self.point_value = 0
        self.location_x = -1
        self.location_y = -1
        self.save(update_fields=['location_x','location_y','point_value','health'])
        return point_value
    
class Archer(Piece):
    class Meta:
        proxy = True
    def move_piece(self, location):
        self.attack = 0
        self.save(update_fields=['attack'])
        Piece.move_piece(self, location)

class Scout(Piece):
    class Meta:
        proxy = True
    def move_piece(self, location):
        if max(abs(self.location_x - location[0]), abs(self.location_y - location[1])) == 3:
            self.attack = 0
            self.save(update_fields=['attack'])
        Piece.move_piece(self, location)

    def attack_piece(self, location):
        game_state = Piece.attack_piece(self, location)
        self.speed = min(self.speed,2)
        self.save(update_fields=['speed'])
        return game_state

class IceWizard(Piece):
    class Meta:
        proxy = True
    def freeze_special(self, location):
        self.refresh_from_db()
        if self.game.state != "PLAYING":
            raise IllegalMoveError("Must be in the PLAYING state to freeze")
        if not self.player.is_current_turn():
            raise IllegalMoveError("Must be current turn to freeze")
        if self.special == 0:
            raise IllegalMoveError("{} has no available freeze".format(self))
        if not self.is_range_valid(location, self.character.special_range_min, self.character.special_range_max):
            raise IllegalMoveError("The target is outside of range to freeze")
        target_piece = self.game.get_piece_by_location(location)
        if target_piece:
            target_piece = target_piece.freeze()
            logging.info("[{}] {} froze {} with {}".format(self.game, self.player, target_piece, self))
            self.special = 0
            self.save(update_fields=['special'])
        else:
            raise IllegalMoveError("There is no target to freeze at this location")
        self.game.refresh_from_db()
        return self.game

class Cleric(Piece):
    class Meta:
        proxy = True
    def take_damage(self, damage):
        piece = Piece.take_damage(self, damage)
        if piece.health == 0:
            self.update_shields(False)
            logging.info("[{}] {} has lost shields".format(self.game, self.player))
        return piece

    def update_shields(self, value):
        for piece in self.game.piece_set.all().filter(player = self.player):
            piece.shield = value
            piece.save(update_fields=['shield'])

class Werewolf(Piece):
    class Meta:
        proxy = True
    def finish_attack(self):
        self.attack = 0
        self.attack_start += 1
        logging.info("[{}] The attack of {}'s Werewolf increased to {}'".format(self.game, self.player, self.attack_start))
        self.save(update_fields=['attack', 'attack_start'])