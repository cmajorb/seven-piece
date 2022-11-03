from rest_framework import serializers

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