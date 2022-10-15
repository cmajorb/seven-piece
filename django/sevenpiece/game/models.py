import uuid
from django.db import models
import json
from game.data.constants import MAP_DEFINITION
from game.exceptions import IllegalMoveError, JoinGameError, IllegalPieceSelection
import logging
from django.db.models import Sum


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

    def __str__(self):
        return str(self.session)

    def get_piece_by_location(self, location):
        return self.piece_set.all().filter(location_x=location[0], location_y=location[1]).first()

    def init_game(self):
        self.state = "PLACING"
        for piece in self.piece_set.all():
            if piece.character.name == "Cleric":
                piece.cast_piece().update_shields(True)
            piece.reset_stats()
            piece.health = piece.character.health
            piece.health_start = piece.character.health #plus buffer
            piece.speed_start = piece.character.speed #plus buffer
            piece.attack_start = piece.character.attack #plus buffer
            piece.save(update_fields=['health','health_start','speed_start','attack_start'])
        self.save(update_fields=['state'])

    def start_game(self):
        self.state = "PLAYING"
        objectives = []
        for val in sum(self.map.data["data"], []):
            if val == MAP_DEFINITION['objective']:
                objectives.append("-1")
        self.objectives = ",".join(objectives)
        self.save(update_fields=['objectives','state'])

    def join_game(self, session):
        num_of_players = len(self.player_set.all())
        if num_of_players >= self.map.player_size:
            logging.info("New spectator")
            spectator = Player.objects.create(session=session, game=None, number=-1)
            return [self, spectator]
            # raise JoinGameError
        player = Player.objects.create(session=session, game=self, number=num_of_players)
        if num_of_players + 1 == self.map.player_size:
            self.state = "SELECTING"
            self.save(update_fields=['state'])
        return [self, player]

    def end_game(self, winner):

        logging.info("The winner is player {}".format(winner.number))
        self.state = "FINISHED"
        self.winner = winner.number
        self.save(update_fields=['state','winner'])
        #Delete the game_state?
        
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
        for player in state.player_set.all():
            dictionary["players"].append(player.get_info())

        return json.dumps(dictionary, indent = 4)

    def get_game_summary(state):
        if state == None:
            return None
        dictionary = {}
        dictionary["score"] = ""
        pieces = []
        for piece in state.piece_set.all():
            pieces.append("Name: {}({}:{}), Speed: {}, Attack: {}, Health: {}, Location: ({}, {})".format(piece.character.name, piece.player.session, piece.id, piece.speed, piece.attack, piece.health, piece.location_x, piece.location_y))
        dictionary["pieces"] = pieces
        for player in state.player_set.all():
            dictionary["score"] += "{} ({}), ".format(player.id, player.score)
        return dictionary

class Player(models.Model):
    session = models.CharField(max_length=50, null=False, default="")
    game = models.ForeignKey(GameState, on_delete=models.CASCADE, null=True)
    score = models.IntegerField(default=0)
    number = models.IntegerField()
    ready = models.BooleanField(default=False)

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
        dictionary["session"] = self.session
        dictionary["ready"] = self.ready
        return dictionary

    def is_current_turn(self):
        return self.game.turn_count % self.game.map.player_size == self.number

    def select_pieces(self, pieces):
        all_pieces = []
        if self.game.state != "SELECTING":
            raise IllegalPieceSelection
        if len(pieces) != self.game.map.num_characters:
            raise IllegalPieceSelection
        if len(self.piece_set.all()) != 0:
            logging.error("You already have pieces")
            raise IllegalPieceSelection
        logging.info("Selecting for {}".format(self.number))
        for i, piece in enumerate(pieces):
            start_tile = self.game.map.data["start_tiles"][self.number][i]
            character = Character.objects.get(name=piece)
            new_piece = Piece.objects.create(character=character, game=self.game, player=self)
            new_piece = new_piece.cast_piece()
            new_piece.make_move([start_tile[0],start_tile[1]])
            all_pieces.append(new_piece)
        if len(self.game.piece_set.all()) == self.game.map.num_characters * self.game.map.player_size:
            self.game.init_game()
        return all_pieces

    def end_turn(self):
        #Check to make sure all pieces have moved
        self.game.refresh_from_db()
        if self.game.state == "PLACING":
            self.ready = True
            self.save(update_fields=['ready'])
            if len(self.game.player_set.filter(ready=True)) == self.game.map.player_size:
                self.game.start_game()
            return self.game
        if self.game.state != "PLAYING":
            print("Not in the right game state")
            raise IllegalMoveError
        if self.is_current_turn():
            current_scores = self.game.objectives.split(",")
            for player in self.game.player_set.all():
                print("Player {} score: {}".format(player.number, player.score + current_scores.count(str(player.number))))
                if player.score + current_scores.count(str(player.number)) >= self.game.map.score_to_win:
                    self.game.end_game(player)
            self.game.turn_count = self.game.turn_count + 1
            self.game.save(update_fields=['turn_count'])
            for piece in self.game.piece_set.all().filter(player = self):
                piece.reset_stats()
        else:
            print("Not your turn")
            raise IllegalMoveError
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
    game = models.ForeignKey(GameState, on_delete=models.CASCADE, null=False)
    special = models.IntegerField(default=0)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=False)
    point_value = models.IntegerField(default=1)
    state = models.CharField(max_length=50, default='normal')

    def __str__(self):
        return self.character.name

    def cast_piece(self):
        if self.character.name == "Ice Wizard":
            return IceWizard.objects.get(id=self.id)
        elif self.character.name == "Scout":
            return Scout.objects.get(id=self.id)
        elif self.character.name == "Archer":
            return Archer.objects.get(id=self.id)
        elif self.character.name == "Cleric":
            return Cleric.objects.get(id=self.id)
        return self

    def reset_stats(self):
        self.speed = self.character.speed
        self.attack = self.character.attack
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
        if self.health < 0:
            self.health = 0
        self.save(update_fields=['health'])
        return self

    def attack_piece(self, location):
        #check to make sure it isn't on their team
        if self.game.state != "PLAYING":
            raise IllegalMoveError("Must be in the PLAYING game state")
        print("Attack: {}/{}".format(self.attack, self.character.attack))
        if not self.player.is_current_turn():
            print("Not your turn")
            raise IllegalMoveError("It is not the player's turn")
        if self.attack == 0:
            print("No available attack")
            raise IllegalMoveError("The piece has no available attack")
        if not self.is_range_valid(location, self.character.attack_range_min, self.character.attack_range_max):
            print("Out of range")
            raise IllegalMoveError("The target is outside of range")
        target_piece = self.game.get_piece_by_location(location)
        if target_piece:
            target_piece = target_piece.cast_piece()
            target_piece = target_piece.take_damage(self.attack)
            self.attack = 0
            self.save(update_fields=['attack'])
            logging.info(target_piece.player.piece_set.all().aggregate(Sum('health'))['health__sum'])
            if target_piece.player.piece_set.all().aggregate(Sum('health'))['health__sum'] == 0:
                self.game.end_game(self.player)
        else:
            print("No piece there")
            raise IllegalMoveError("No piece could be found at that location")
        if target_piece.health <= 0:
            points = target_piece.remove_piece()
            self.player.score += points
            self.player.save(update_fields=['score'])
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
            raise IllegalMoveError
        if not self.player.is_current_turn():
            print("Not your turn")
            raise IllegalMoveError
        print("Speed: {}".format(self.speed))
        if not self.is_range_valid(location, 0, self.speed):
            print("Out of range")
            raise IllegalMoveError
        if self.game.map.data["data"][location[0]][location[1]] not in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']]:
            print("Not a valid tile")
            raise IllegalMoveError
        self.move_piece(location)
        self.game.refresh_from_db()
        return self.game

    def capture_objective(self, location):
        flat_board = sum(self.game.map.data["data"], [])
        current_scores = self.game.objectives.split(",")
        flat_location = location[0] * len(self.game.map.data["data"][0]) + location[1]
        score_location = 0
        for i, val in enumerate(flat_board):
            if i == flat_location:
                break
            if val & MAP_DEFINITION['objective'] == MAP_DEFINITION['objective']:
                score_location += 1
        current_scores[score_location] = str(self.player.number)
        self.game.objectives = ",".join(current_scores)
        self.game.save(update_fields=['objectives'])

    def move_piece(self, location):
        print("Player {} moved {} to ({}, {})".format(self.player.number, self.character.name, location[0], location[1]))
        previous_x = self.location_x
        previous_y = self.location_y
        self.location_x = location[0]
        self.location_y = location[1]
        self.speed = 0
        self.save(update_fields=['location_x','location_y','speed'])
        board = self.game.map.data["data"]
        if board[location[0]][location[1]] == MAP_DEFINITION['objective']:
            self.capture_objective(location)
            print("Captured Objective!")
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
        valid_tiles = self.game.map.data["start_tiles"][self.player.number]
        if location in valid_tiles and self.game.map.data["data"][location[0]][location[1]] == MAP_DEFINITION['normal']:
            self.move_placed_piece(location)
        else:
            print("Not a valid start tile")
            raise IllegalMoveError

        #Check to see if all pieces are placed
        # if len(self.game.piece_set.all().filter(location_x__isnull=False)) == self.game.map.num_characters * self.game.map.player_size:
        #     self.game.start_game()

    def is_range_valid(self, location, range_min, range_max):
        #This fails to check if there is an obstacle in the way
        map_length_x = len(self.game.map.data["data"])
        map_length_y = len(self.game.map.data["data"][0])
        x_diff = abs(self.location_x - location[0])
        y_diff = abs(self.location_y - location[1])
        if location[0] < map_length_x and location[1] < map_length_y and location[0] >= 0 and location[1] >= 0: 
            if self.location_x == location[0] and y_diff <= range_max and y_diff >= range_min:
                return True
            elif self.location_y == location[1] and x_diff <= range_max and x_diff >= range_min:
                return True
            elif x_diff == y_diff and x_diff <= range_max and x_diff >= range_min:
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
        print("Archer move")
        self.attack = 0
        self.save(update_fields=['attack'])
        Piece.move_piece(self, location)

class Scout(Piece):
    class Meta:
        proxy = True
    def move_piece(self, location):
        print("Scout move")
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
        print("Running freeze move")
        if self.game.state != "PLAYING":
            raise IllegalMoveError
        if not self.player.is_current_turn():
            print("Not your turn")
            raise IllegalMoveError
        if self.special == 0:
            print("No available special")
            raise IllegalMoveError
        if not self.is_range_valid(location, self.character.special_range_min, self.character.special_range_max):
            print("Out of range")
            raise IllegalMoveError
        target_piece = self.game.get_piece_by_location(location)
        if target_piece:
            target_piece = target_piece.freeze()
            self.special = 0
            self.save(update_fields=['special'])
        else:
            print("No piece there")
            raise IllegalMoveError
        self.game.refresh_from_db()
        return self.game

class Cleric(Piece):
    class Meta:
        proxy = True
    def take_damage(self, damage):
        piece = Piece.take_damage(self, damage)
        if piece.health == 0:
            self.update_shields(False)
        return piece

    def update_shields(self, value):
        for piece in self.game.piece_set.all().filter(player = self.player):
            piece.shield = value
            piece.save(update_fields=['shield'])