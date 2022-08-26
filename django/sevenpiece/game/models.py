from django.db import models

class ColorScheme(models.Model):
    name = models.CharField(max_length=150, null=False, unique=False)
    scheme = models.JSONField()
    max_player_size = models.IntegerField()
    def __str__(self):
        return self.name + "(" + self.max_player_size + ") "

class Map(models.Model):
    name = models.CharField(max_length=150, null=False, unique=False)
    data = models.JSONField()
    player_size = models.IntegerField()
    color_scheme = models.ForeignKey(ColorScheme, on_delete=models.SET_NULL, null=True)
    def __str__(self):
        return self.name + "(" + self.player_size + ") "