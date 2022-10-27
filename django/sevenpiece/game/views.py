from django.shortcuts import render
from django.views.generic import View
   
from rest_framework.views import APIView
from rest_framework.response import Response
from game.models import GameState, Player

from collections import Counter

def index(request):
    stats = GameState.objects.order_by('created')

    data = Counter()
    for row in stats:
        yymmdd = row.created.strftime("%Y-%m-%d")
        data[yymmdd] += 1

    total_games_labels, total_games_values = zip(*data.items())

    players = Player.objects.all()
    data = Counter()
    for player in players:
        pieces = player.piece_set.all().order_by('character__name')
        team = ', '.join(str(p.character.name) for p in pieces)
        if team != "":
            data[team] += 1
    teams_labels, teams_values = zip(*data.items())

    context = {
        "total_games_labels": total_games_labels,
        "total_games_values": total_games_values,
        "teams_labels": teams_labels,
        "teams_values": teams_values,
    }
    return render(request, "graph.html", context)