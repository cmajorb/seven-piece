import uuid
from django.db import models
from django.contrib.auth.models import User
import json
from game.data.constants import MAP_DEFINITION
from game.exceptions import IllegalMoveError, JoinGameError, IllegalPieceSelection

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

class Character(models.Model):
    name = models.CharField(max_length=150, null=False, unique=False)
    health = models.IntegerField()
    attack = models.IntegerField()
    speed = models.IntegerField()
    special = models.CharField(max_length=150)
    image = models.CharField(max_length=150)
    description = models.CharField(max_length=500)
    attack_range_min = models.IntegerField(default=1)
    attack_range_max = models.IntegerField(default=1)
    
    def __str__(self):
        return self.name + " ({})".format(str(self.id))



class GameState(models.Model):
    session = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    map = models.ForeignKey(Map, on_delete=models.CASCADE, null=True)
    state = models.CharField(max_length=50, default='WAITING', choices=[('WAITING', 'Waiting for players'), ('READY', 'Ready to play'), ('PLACING', 'Placing pieces'), ('PLAYING', 'Game in progress'), ('FINISHED', 'Game Over')])
    turn_count = models.IntegerField(default=0)
    objectives = models.CharField(max_length=50, default="")

    def __str__(self):
        return str(self.session)

    def get_piece_by_location(self, location):
        return self.piece_set.all().filter(location_x=location[0], location_y=location[1]).first()

    def init_game(self):
        self.state = "PLACING"
        for piece in self.piece_set.all():
            piece.health = piece.character.health
            piece.speed = piece.character.speed
            piece.attack = piece.character.attack
            piece.save(update_fields=['health','speed','attack'])
        self.save(update_fields=['state'])

    def start_game(self):
        self.state = "PLAYING"
        objectives = []
        for val in sum(self.map.data["data"], []):
            if val == MAP_DEFINITION['objective']:
                objectives.append("-1")
        self.objectives = ",".join(objectives)
        self.save(update_fields=['objectives','state'])

    def join_game(self, user):
        num_of_players = len(self.player_set.all())
        if num_of_players >= self.map.player_size:
            raise JoinGameError
        Player.objects.create(user=user, game=self, number=num_of_players)
        if num_of_players + 1 == self.map.player_size:
            self.state = "READY"
            self.save(update_fields=['state'])
        return self

    def end_game(self, winner):
        print("The winner is player {}".format(winner.number))
        self.state = "FINISHED"
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
        for piece in state.piece_set.all():
            dictionary["pieces"].append(piece.get_info())

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
    game = models.ForeignKey(GameState, on_delete=models.CASCADE, null=False)
    score = models.IntegerField(default=0)
    number = models.IntegerField()

    def is_current_turn(self):
        return self.game.turn_count % self.game.map.player_size == self.number

    def select_pieces(self, pieces):
        all_pieces = []
        if self.game.state != "READY":
            return IllegalPieceSelection
        if len(pieces) != self.game.map.num_characters:
            raise IllegalPieceSelection
        for piece in pieces:
            character = Character.objects.get(name=piece)
            all_pieces.append(Piece.objects.create(character=character, game=self.game, player=self))
        if len(self.game.piece_set.all()) == self.game.map.num_characters * self.game.map.player_size:
            self.game.init_game()
        return all_pieces

    def end_turn(self):
        #Check to make sure all pieces have moved
        self.game.refresh_from_db()
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
            for piece in self.game.piece_set.all():
                piece.speed = piece.character.speed
                piece.attack = piece.character.attack
                piece.save(update_fields=['speed', 'attack'])
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
    game = models.ForeignKey(GameState, on_delete=models.CASCADE, null=False)
    speed = models.IntegerField(default=0)
    attack = models.IntegerField(default=0)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=False)
    point_value = models.IntegerField(default=1)

    def __str__(self):
        return self.character.name

    def get_info(piece):
        if piece == None:
            return None
        dictionary = {}
        dictionary["character"] = piece.character.name
        dictionary["player"] = piece.player.number
        dictionary["health"] = piece.health
        dictionary["location"] = [piece.location_x, piece.location_y]
        dictionary["speed"] = piece.speed
        dictionary["attack"] = piece.attack
        dictionary["image"] = piece.character.image
        return dictionary
    
    def take_damage(self, damage):
        self.health -= damage
        self.save(update_fields=['health'])
        return self

    def attack_piece(self, location):
        #check to make sure it isn't on their team
        if self.game.state != "PLAYING":
            raise IllegalMoveError
        print("Attack: {}/{}".format(self.attack, self.character.attack))
        if not self.player.is_current_turn():
            print("Not your turn")
            raise IllegalMoveError
        if self.attack == 0:
            print("No available attack")
            raise IllegalMoveError
        if not self.is_range_valid(location, self.character.attack_range_min, self.character.attack_range_max):
            print("Out of range")
            raise IllegalMoveError
        target_piece = self.game.get_piece_by_location(location)
        if target_piece:
            target_piece = target_piece.take_damage(self.attack)
        else:
            print("No piece there")
            raise IllegalMoveError
        if target_piece.health <= 0:
            points = target_piece.remove_piece()
            self.player.score += points
            self.player.save(update_fields=['score'])
        self.game.refresh_from_db()
        return self.game

    def make_move(self, location):
        self.refresh_from_db()
        self.game.refresh_from_db()
        if self.game.state == "PLACING":
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

        #For Scout
        if max(abs(self.location_x - location[0]), abs(self.location_y - location[1])) == 3:
            self.attack = 0
            self.save(update_fields=['attack'])
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
        self.location_x = location[0]
        self.location_y = location[1]
        self.save(update_fields=['location_x','location_y'])

        board = self.game.map.data["data"]
        board[location[0]][location[1]] |=  MAP_DEFINITION['player']
        self.game.map.data["data"] = board
        self.game.map.save(update_fields=['data'])

    def place_piece(self, location):
        valid_tiles = self.game.map.data["start_tiles"][self.player.number]
        if location in valid_tiles:
            self.move_placed_piece(location)
        else:
            print("Not a valid start tile")
            raise IllegalMoveError

        #Check to see if all pieces are placed
        if len(self.game.piece_set.all().filter(location_x__isnull=False)) == self.game.map.num_characters * self.game.map.player_size:
            self.game.start_game()

    def is_range_valid(self, location, range_min, range_max):
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
    