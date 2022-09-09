import uuid
from django.db import models
from django.contrib.auth.models import User
import json

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
    attack_range = models.IntegerField(default=1)
    
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
            pieces.append("Name: {}({}), Range: {}, Attack: {}, Health: {}, Location: ({}, {})".format(piece.character.name, piece.player.user.id, piece.range, piece.attack, piece.health, piece.location_x, piece.location_y))
        dictionary["pieces"] = pieces
        for player in state.player_set.all():
            dictionary["score"] += "{} ({}), ".format(player.id, player.score)
        return dictionary

class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    game = models.ForeignKey(GameState, on_delete=models.CASCADE, null=False)
    score = models.IntegerField(default=0)
    number = models.IntegerField()

class Piece(models.Model):
    character = models.ForeignKey(Character, on_delete=models.CASCADE, null=True)
    location_x = models.IntegerField(null=True)
    location_y = models.IntegerField(null=True)
    health = models.IntegerField(default=0)
    game = models.ForeignKey(GameState, on_delete=models.CASCADE, null=False)
    range = models.IntegerField(default=0)
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
        dictionary["range"] = piece.range
        dictionary["attack"] = piece.attack
        dictionary["image"] = piece.character.image
        return dictionary