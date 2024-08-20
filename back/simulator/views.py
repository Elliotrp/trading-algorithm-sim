from rest_framework.response import Response
from rest_framework.views import APIView
from .services.simulation_engine import SimulationEngine
from .serializers import SimulationRequestSerializer
from .services import strategies

class SimulationView(APIView):
    def post(self, request):
        serializer = SimulationRequestSerializer(data = request.data)
        if serializer.is_valid():
            dto_data = serializer.validated_data
            start_date = dto_data.get('start_date')
            end_date = dto_data.get('end_date')
            symbol = dto_data.get('symbol')
            strategy = dto_data.get('strategy')
            strategy_config = dto_data.get('strategy_config')
            
            strategy_class = getattr(strategies, strategy, None)
            if strategy_class is None:
                return Response({'error': 'Invalid strategy name'}, status=400)
            
            try:
                simulation = SimulationEngine(symbol, start_date, end_date, strategy_class, strategy_config)
                simulation.execute()
                return Response(simulation.output_data)
            except Exception as exception:
                return Response({'error': str(exception)}, status=400)           
        else:
            return Response(serializer.errors, status=400)
