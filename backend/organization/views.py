"""
Views pre organization aplikáciu.

Obsahuje API views pre správu organizácií, profile organizácií
a štatistiky organizácií.
"""

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction

from .models import Organization
from .serializers import (
    OrganizationSerializer,
    OrganizationDetailSerializer,
    OrganizationStatsSerializer
)


class OrganizationDetailView(APIView):
    """
    API view pre detail aktuálnej organizácie používateľa.
    
    GET: Vráti detail organizácie
    PUT/PATCH: Aktualizuje organizáciu
    DELETE: Zmaže organizáciu (iba pre admin)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_organization(self, request):
        """Vráti organizáciu používateľa."""
        if not request.user.organization:
            return None
        return request.user.organization
    
    @extend_schema(
        operation_id='organization_detail_get',
        summary='Detail organizácie',
        description='Vráti detailné informácie o organizácii aktuálne prihláseného používateľa.',
        tags=['Organizácie'],
        responses={
            200: OrganizationDetailSerializer,
            400: OpenApiResponse(description='Používateľ nemá priradenú organizáciu'),
            401: OpenApiResponse(description='Neautorizovaný prístup'),
        }
    )
    def get(self, request):
        """Vráti detail organizácie používateľa."""
        organization = self.get_organization(request)
        if not organization:
            return Response(
                {"detail": "Používateľ nemá priradenú organizáciu."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = OrganizationDetailSerializer(organization)
        return Response(serializer.data)
    
    def put(self, request):
        """Aktualizuje organizáciu (plná aktualizácia)."""
        if not request.user.can_manage_organization:
            return Response(
                {"detail": "Nemáte oprávnenie upravovať organizáciu."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        organization = self.get_organization(request)
        if not organization:
            return Response(
                {"detail": "Používateľ nemá priradenú organizáciu."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = OrganizationSerializer(
            organization,
            data=request.data,
            partial=False
        )
        if serializer.is_valid():
            serializer.save()
            response_serializer = OrganizationDetailSerializer(organization)
            return Response(response_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """Aktualizuje organizáciu (čiastočná aktualizácia)."""
        if not request.user.can_manage_organization:
            return Response(
                {"detail": "Nemáte oprávnenie upravovať organizáciu."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        organization = self.get_organization(request)
        if not organization:
            return Response(
                {"detail": "Používateľ nemá priradenú organizáciu."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = OrganizationSerializer(
            organization,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            response_serializer = OrganizationDetailSerializer(organization)
            return Response(response_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        """Zmaže organizáciu (iba pre superuser)."""
        if not request.user.is_superuser:
            return Response(
                {"detail": "Nemáte oprávnenie mazať organizáciu."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        organization = self.get_organization(request)
        if not organization:
            return Response(
                {"detail": "Používateľ nemá priradenú organizáciu."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        with transaction.atomic():
            # Zmaže všetkých používateľov organizácie
            organization.users.all().delete()
            # Zmaže organizáciu
            organization.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrganizationListView(APIView):
    """
    API view pre zoznam organizácií (iba pre superuser).
    
    GET: Vráti zoznam všetkých organizácií
    POST: Vytvorí novú organizáciu
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Vráti zoznam organizácií (iba pre superuser)."""
        if not request.user.is_superuser:
            return Response(
                {"detail": "Nemáte oprávnenie pristupovať k zoznamu organizácií."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        organizations = Organization.objects.all().order_by('-created_at')
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Vytvorí novú organizáciu (iba pre superuser)."""
        if not request.user.is_superuser:
            return Response(
                {"detail": "Nemáte oprávnenie vytvárať organizácie."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = OrganizationSerializer(data=request.data)
        if serializer.is_valid():
            organization = serializer.save()
            response_serializer = OrganizationDetailSerializer(organization)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    operation_id='organization_stats',
    summary='Štatistiky organizácie',
    description='Vráti detailné štatistiky a metriky organizácie aktuálne prihláseného používateľa.',
    tags=['Organizácie'],
    responses={
        200: OrganizationStatsSerializer,
        400: OpenApiResponse(description='Používateľ nemá priradenú organizáciu'),
        401: OpenApiResponse(description='Neautorizovaný prístup'),
    },
    examples=[
        OpenApiExample(
            'Štatistiky organizácie',
            value={
                'organization_id': 1,
                'name': 'Test Organization',
                'organization_type': 'client',
                'organization_type_display': 'Klient',
                'is_active': True,
                'is_client': True,
                'is_partner': False,
                'active_users_count': 5,
                'vehicles_count': 3,
                'trips_count': 150,
                'ico': '12345678',
                'dic': '1234567890'
            },
            response_only=True
        )
    ]
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def organization_stats(request):
    """
    Vráti štatistiky organizácie aktuálneho používateľa.
    
    Obsahuje základné informácie o organizácii ako počet používateľov,
    vozidiel, jázd a ďalšie metriky.
    """
    organization = request.user.organization
    if not organization:
        return Response(
            {"detail": "Používateľ nemá priradenú organizáciu."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    stats = {
        'organization_id': organization.id,
        'name': organization.name,
        'organization_type': organization.organization_type,
        'organization_type_display': organization.get_organization_type_display(),
        'is_active': organization.is_active,
        'is_client': organization.is_client,
        'is_partner': organization.is_partner,
        'created_at': organization.created_at,
        'updated_at': organization.updated_at,
        'ico': organization.ico,
        'dic': organization.dic,
        'active_users_count': organization.get_active_users_count(),
        'vehicles_count': organization.get_vehicles_count(),
        'trips_count': organization.get_trips_count(),
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def organization_users(request):
    """
    Vráti zoznam používateľov v organizácii aktuálneho používateľa.
    
    Jednoduchý endpoint pre rýchly prístup k používateľom bez potreby
    volať komplexný user endpoint.
    """
    organization = request.user.organization
    if not organization:
        return Response(
            {"detail": "Používateľ nemá priradenú organizáciu."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    users = organization.users.filter(is_active=True).values(
        'id', 'username', 'email', 'first_name', 'last_name',
        'is_organization_admin', 'position', 'phone', 'date_joined', 'last_login'
    )
    
    return Response(list(users))


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_organization_status(request):
    """
    Prepne stav organizácie (aktívna/neaktívna).
    
    Iba pre admin organizácie alebo superuser.
    """
    if not request.user.can_manage_organization:
        return Response(
            {"detail": "Nemáte oprávnenie meniť stav organizácie."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    organization = request.user.organization
    if not organization:
        return Response(
            {"detail": "Používateľ nemá priradenú organizáciu."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Prepne stav
    organization.is_active = not organization.is_active
    organization.save(update_fields=['is_active', 'updated_at'])
    
    serializer = OrganizationDetailSerializer(organization)
    return Response({
        'detail': f"Stav organizácie bol zmenený na {'aktívna' if organization.is_active else 'neaktívna'}.",
        'organization': serializer.data
    })