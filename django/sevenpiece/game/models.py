import uuid
from django.db import models

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
    
    def __str__(self):
        return self.name



class GameState(models.Model):
    session = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    map = models.ForeignKey(Map, on_delete=models.CASCADE, null=True)
    state = models.JSONField()

    def __str__(self):
        return str(self.session)

    def get_game_state(state):
        if state == None:
            return None
        dictionary = {}
        dictionary["session"] = str(state.session)
        dictionary["state"] = state.state
        dictionary["map"] = state.map.data

        return dictionary

class Piece(models.Model):
    character = models.ForeignKey(Character, on_delete=models.CASCADE, null=True)
    location_x = models.IntegerField()
    location_y = models.IntegerField()
    health = models.IntegerField()
    game = models.ForeignKey(GameState, on_delete=models.CASCADE, null=False)
    range = models.IntegerField()
    def __str__(self):
        return self.character.name