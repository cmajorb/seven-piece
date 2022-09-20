from django.contrib import admin
from game.models import Map, ColorScheme, GameState, Piece, Character, Player, MapTemplate
# Register your models here.

admin.site.register(Map)
admin.site.register(ColorScheme)
admin.site.register(GameState)
admin.site.register(Piece)
admin.site.register(Character)
admin.site.register(Player)
admin.site.register(MapTemplate)