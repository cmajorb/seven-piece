from rest_framework import serializers

class MapSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=150)
    player_size = serializers.IntegerField()
    num_characters = serializers.IntegerField()
    score_to_win = serializers.IntegerField()
    