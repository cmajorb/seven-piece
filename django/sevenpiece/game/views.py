from django.shortcuts import render
from rest_framework.response import Response
from game.models import GameState, Player, Character, MapTemplate

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from game.serializers import UserSerializer, MapSerializer, CharacterSerializer, UserStatsSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from collections import Counter

@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
def current_user_stats(request):
    serializer = UserStatsSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    post_data = request.data
    request.user = User.objects.filter(username='admin').first()
    same_email_users = User.objects.filter(email=post_data['email'])
    if len(same_email_users) > 0:
        return Response("EMAIL")
    same_username_users = User.objects.filter(username=post_data['username'])
    if len(same_username_users) > 0:
        return Response("USERNAME")
    try:
        new_user = User.objects.create(
            username=post_data['username'],
            first_name=post_data['firstName'],
            last_name=post_data['lastName'],
            email=post_data['email'],
            is_superuser=False,
            is_staff=False
        )
        new_user.password = make_password((post_data['password']))
        new_user.save()
        serializer = UserSerializer(User.objects.filter(id=new_user.id).first())
        return Response(serializer.data)
    except Exception as e:
        return Response(e)

@api_view(['GET'])
def get_maps(request):
    maps = MapTemplate.objects.all()
    serializer = MapSerializer(maps, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_characters(request):
    characters = Character.objects.all()
    serializer = CharacterSerializer(characters, many=True)
    return Response(serializer.data)

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