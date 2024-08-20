from rest_framework import serializers

class SimulationRequestSerializer(serializers.Serializer):
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    symbol = serializers.CharField()
    strategy = serializers.CharField()
    strategy_config = serializers.DictField()
