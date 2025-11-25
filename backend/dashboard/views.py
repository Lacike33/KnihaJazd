"""
Views pre dashboard aplikáciu.

Obsahuje všetky API endpointy súvisiace s dashboard funkcionalitou.
Používa proper architektúru s oddeľovaním biznis logiky do services
a validáciou cez serializers.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny  # Dočasne pre testovanie
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .services import DashboardService
from .serializers import DashboardStatsSerializer, DashboardResponseSerializer


@extend_schema(
    operation_id="dashboard_stats",
    description="""
    Získa kompletné štatistiky pre dashboard používateľa.
    
    Endpoint vracia súhrné informácie o jazdách, celkových vzdialenostiach,
    aktuálnom vozidle a posledných jazdách používateľa. Momentálne pracuje
    s mock dátami pre účely vývoja.
    
    **Poznámka:** V produkcii bude vyžadované prihlásenie používateľa.
    """,
    summary="Štatistiky dashboard používateľa",
    tags=["Dashboard"],
    responses={
        200: OpenApiResponse(
            description="Úspešne získané štatistiky dashboard",
            response=DashboardResponseSerializer
        ),
        401: OpenApiResponse(
            description="Neautorizovaný prístup - vyžaduje prihlásenie"
        ),
        500: OpenApiResponse(
            description="Interná chyba servera"
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])  # Dočasne pre testovanie - neskôr zmeniť na IsAuthenticated
def dashboard_stats(request):
    """
    API endpoint pre získanie štatistík dashboard používateľa.
    
    Returns:
        Response: JSON s kompletými štatistikami používateľa
    """
    try:
        # Získanie dát cez service layer
        stats_data = DashboardService.get_user_dashboard_stats(user=request.user)
        
        # Validácia a transformácia cez serializer
        serializer = DashboardStatsSerializer(data=stats_data)
        serializer.is_valid(raise_exception=True)
        
        # Zabalenie do štandardného response formátu s 'data' objektom
        response_data = {
            "data": serializer.validated_data
        }
        
        return Response(
            response_data, 
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        # V produkcii by sme logovali chybu a vrátili generickú odpoveď
        return Response(
            {"error": "Nastala chyba pri získavaní štatistík"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
