from rest_framework import serializers

class TypeChoixSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()

