from rest_framework import serializers
from game.models import Player, Piece
from django.contrib.auth.models import User

class MapSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=150)
    player_size = serializers.IntegerField()
    num_characters = serializers.IntegerField()
    score_to_win = serializers.IntegerField()
    
class CharacterSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=150)
    health = serializers.IntegerField()
    attack = serializers.IntegerField()
    speed = serializers.IntegerField()
    special = serializers.CharField(max_length=150)
    image = serializers.CharField(max_length=150)
    description = serializers.CharField(max_length=500)
    attack_range_min = serializers.IntegerField()
    attack_range_max = serializers.IntegerField()
    special_range_min = serializers.IntegerField()
    special_range_max = serializers.IntegerField()

class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField(required=True)

class PieceSerializer(serializers.ModelSerializer):
    character_name = serializers.ReadOnlyField(source='character.name')
    class Meta:
        model = Piece
        fields = ('id', 'character_name', 'stats_movements', 'stats_damage_dealt', 'stats_damage_taken', 'stats_wins', 'stats_games_played', 'stats_kills', 'stats_objectives_captured', 'stats_deaths')

class PlayerSerializer(serializers.ModelSerializer):
    piece_set = PieceSerializer(many=True)
    class Meta:
        model = Player
        fields = ('stats_wins', 'stats_games_played', 'piece_set')

class UserStatsSerializer(serializers.ModelSerializer):
    player_set = PlayerSerializer(many=True)
    class Meta:
        model = User
        fields = ('id', 'player_set')    

class LeaderboardSerializer(serializers.ModelSerializer):
    player_username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Player
        fields = ('id', 'player_username', 'stats_wins', 'stats_games_played')    
