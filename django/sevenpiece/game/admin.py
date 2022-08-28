from django.contrib import admin
from game.models import Map, ColorScheme, GameState
# Register your models here.

admin.site.register(Map)
admin.site.register(ColorScheme)
admin.site.register(GameState)
