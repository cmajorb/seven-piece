from django.urls import path
from game.consumers import GameConsumer

websocket_urlpatterns = [path("<room>", GameConsumer.as_asgi())]
