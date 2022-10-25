from django.shortcuts import render
from django.views.generic import View
   
from rest_framework.views import APIView
from rest_framework.response import Response
from game.models import GameState

from collections import Counter

def index(request):
    stats = GameState.objects.order_by('created')

    data = Counter()
    for row in stats:
        yymmdd = row.created.strftime("%Y-%m-%d")
        data[yymmdd] += 1

    labels, values = zip(*data.items())

    context = {
        "labels": labels,
        "values": values,
    }
    return render(request, "graph.html", context)