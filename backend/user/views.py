"""
Views pre user aplikáciu.

Obsahuje API views pre správu používateľov, profily, autentifikáciu
a user/me endpoint pre aktuálne prihláseného používateľa.
"""

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.db import transaction
from django.utils import timezone

from .models import CustomUser
from organization.models import Organization
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
    ChangePasswordSerializer,
    UserStatsSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT login view ktorý aktualizuje last_login field.
    
    Rozširuje štandardný TokenObtainPairView o aktualizáciu last_login
    po úspešnom prihlásení.
    """
    
    @extend_schema(
        operation_id='auth_login',
        summary='Prihlásenie používateľa',
        description='Prihlási používateľa pomocou emailu a hesla. Vráti JWT access a refresh tokeny. Aktualizuje last_login field.',
        tags=['Autentifikácia'],
        examples=[
            OpenApiExample(
                'Prihlásenie používateľa',
                value={
                    'email': 'admin@knihajazd.sk',
                    'password': 'admin123'
                },
                request_only=True
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        """Prihlási používateľa a aktualizuje last_login."""
        # Získaj response z parent view
        response = super().post(request, *args, **kwargs)
        
        # Ak je login úspešný (status 200), aktualizuj last_login
        if response.status_code == 200:
            # Získaj email z request data
            email = request.data.get('email')
            if email:
                try:
                    user = CustomUser.objects.get(email=email)
                    user.last_login = timezone.now()
                    user.save(update_fields=['last_login'])
                except CustomUser.DoesNotExist:
                    pass  # User should exist if login was successful, but better safe
        
        return response


class UserMeView(APIView):
    """
    API view pre aktuálne prihláseného používateľa.
    
    GET: Vráti profil aktuálneho používateľa
    PUT/PATCH: Aktualizuje profil aktuálneho používateľa
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id='user_me_get',
        summary='Profil aktuálneho používateľa',
        description='Vráti detailné informácie o profile aktuálne prihláseného používateľa včítane organizácie.',
        tags=['Používatelia'],
        responses={
            200: UserProfileSerializer,
            401: OpenApiResponse(description='Neautorizovaný prístup - vyžaduje prihlásenie'),
        },
        examples=[
            OpenApiExample(
                'Úspešný response',
                value={
                    'id': 1,
                    'username': 'testuser',
                    'email': 'test@example.com',
                    'first_name': 'Test',
                    'last_name': 'User',
                    'organization_name': 'Test Organization',
                    'is_organization_admin': True,
                    'groups': ['Administrátori'],
                    'group_ids': [1],
                    'permissions': ['user.manage_organization', 'user.create_trips']
                },
                response_only=True
            )
        ]
    )
    def get(self, request):
        """Vráti profil aktuálneho používateľa."""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    @extend_schema(
        operation_id='user_me_update',
        summary='Aktualizácia profilu (úplná)',
        description='Aktualizuje profil aktuálneho používateľa. Vyžaduje všetky polia.',
        tags=['Používatelia'],
        request=UserProfileSerializer,
        responses={
            200: UserProfileSerializer,
            400: OpenApiResponse(description='Chybné údaje v requeste'),
            401: OpenApiResponse(description='Neautorizovaný prístup'),
        }
    )
    def put(self, request):
        """Aktualizuje profil aktuálneho používateľa (plná aktualizácia)."""
        serializer = UserProfileSerializer(
            request.user, 
            data=request.data,
            partial=False
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        operation_id='user_me_partial_update',
        summary='Aktualizácia profilu (čiastočná)',
        description='Čiastočne aktualizuje profil aktuálneho používateľa. Môžete poslať iba polia, ktoré chcete zmeniť.',
        tags=['Používatelia'],
        request=UserProfileSerializer,
        responses={
            200: UserProfileSerializer,
            400: OpenApiResponse(description='Chybné údaje v requeste'),
            401: OpenApiResponse(description='Neautorizovaný prístup'),
        }
    )
    def patch(self, request):
        """Aktualizuje profil aktuálneho používateľa (čiastočná aktualizácia)."""
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    """
    API view pre zoznam používateľov v organizácii.
    
    GET: Vráti zoznam používateľov v organizácii aktuálneho používateľa
    POST: Vytvorí nového používateľa v organizácii
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Vráti zoznam používateľov v organizácii."""
        if not request.user.organization:
            return Response(
                {"detail": "Používateľ nemá priradenú organizáciu."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        users = CustomUser.objects.filter(
            organization=request.user.organization
        ).select_related('organization').prefetch_related('groups')
        
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Vytvorí nového používateľa v organizácii."""
        if not request.user.can_manage_organization:
            return Response(
                {"detail": "Nemáte oprávnenie pridávať používateľov."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not request.user.organization:
            return Response(
                {"detail": "Používateľ nemá priradenú organizáciu."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()
                user.organization = request.user.organization
                user.is_organization_admin = False  # Noví používatelia nie sú automaticky admini
                user.save()
            
            response_serializer = UserSerializer(user)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    """
    API view pre detail používateľa.
    
    GET: Vráti detail používateľa
    PUT/PATCH: Aktualizuje používateľa
    DELETE: Zmaže používateľa
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_user_object(self, request, user_id):
        """Vráti používateľa ak má aktuálny používateľ oprávnenie."""
        try:
            user = CustomUser.objects.select_related('organization').prefetch_related('groups').get(
                id=user_id,
                organization=request.user.organization
            )
            return user
        except CustomUser.DoesNotExist:
            return None
    
    def get(self, request, user_id):
        """Vráti detail používateľa."""
        user = self.get_user_object(request, user_id)
        if not user:
            return Response(
                {"detail": "Používateľ nenájdený."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def put(self, request, user_id):
        """Aktualizuje používateľa (plná aktualizácia)."""
        if not request.user.can_manage_organization:
            return Response(
                {"detail": "Nemáte oprávnenie upravovať používateľov."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = self.get_user_object(request, user_id)
        if not user:
            return Response(
                {"detail": "Používateľ nenájdený."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = UserProfileSerializer(user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, user_id):
        """Aktualizuje používateľa (čiastočná aktualizácia)."""
        if not request.user.can_manage_organization:
            return Response(
                {"detail": "Nemáte oprávnenie upravovať používateľov."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = self.get_user_object(request, user_id)
        if not user:
            return Response(
                {"detail": "Používateľ nenájdený."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, user_id):
        """Zmaže používateľa."""
        if not request.user.can_manage_organization:
            return Response(
                {"detail": "Nemáte oprávnenie mazať používateľov."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = self.get_user_object(request, user_id)
        if not user:
            return Response(
                {"detail": "Používateľ nenájdený."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Zabráni zmazaniu seba samého
        if user.id == request.user.id:
            return Response(
                {"detail": "Nemôžete zmazať seba samého."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChangePasswordView(APIView):
    """
    API view pre zmenu hesla aktuálneho používateľa.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Zmení heslo aktuálneho používateľa."""
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            # Overí staré heslo
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": ["Nesprávne staré heslo."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Nastaví nové heslo
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response(
                {"detail": "Heslo bolo úspešne zmenené."},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """
    API view pre registráciu nového používateľa.
    
    Automaticky vytvorí novú organizáciu a nastaví používateľa ako jej admin.
    """
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        operation_id='user_register',
        summary='Registrácia nového používateľa',
        description='Registruje nového používateľa a automaticky vytvorí novú organizáciu. Používateľ sa nastaví ako admin organizácie.',
        tags=['Autentifikácia'],
        request=UserRegistrationSerializer,
        responses={
            201: UserProfileSerializer,
            400: OpenApiResponse(description='Chybné údaje v requeste'),
        },
        examples=[
            OpenApiExample(
                'Registrácia používateľa',
                value={
                    'username': 'newuser',
                    'email': 'user@example.com',
                    'password': 'securepassword123',
                    'password_confirm': 'securepassword123',
                    'first_name': 'John',
                    'last_name': 'Doe',
                    'organization': {
                        'name': 'My Company',
                        'address': 'Bratislava, Slovakia'
                    }
                },
                request_only=True
            )
        ]
    )
    def post(self, request):
        """Registruje nového používateľa s novou organizáciou."""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Vytvorí používateľa
                user = serializer.save()
                
                # Vytvorí novú organizáciu
                org_data = request.data.get('organization', {})
                organization = Organization.objects.create(
                    name=org_data.get('name', f"Organizácia používateľa {user.username}"),
                    address=org_data.get('address', 'Nezadané'),
                    organization_type='client'
                )
                
                # Priradí používateľa k organizácii a nastaví ako admin
                user.organization = organization
                user.is_organization_admin = True
                user.save()
            
            # Vráti údaje nového používateľa
            response_serializer = UserProfileSerializer(user)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    operation_id='user_stats',
    summary='Štatistiky používateľa',
    description='Vráti detailné štatistiky a informácie o aktivite aktuálne prihláseného používateľa.',
    tags=['Používatelia'],
    responses={
        200: UserStatsSerializer,
        401: OpenApiResponse(description='Neautorizovaný prístup - vyžaduje prihlásenie'),
    },
    examples=[
        OpenApiExample(
            'Štatistiky používateľa',
            value={
                'user_id': 1,
                'username': 'testuser',
                'email': 'test@example.com',
                'is_organization_admin': True,
                'organization': 'Test Organization',
                'organization_type': 'client',
                'date_joined': '2025-01-01T10:00:00Z',
                'last_login': '2025-01-15T14:30:00Z',
                'is_active': True,
                'position': 'Manager',
                'phone': '+421901123456',
                'groups': ['Administrátori', 'Účtovníci'],
                'group_ids': [1, 3],
                'permissions': ['user.manage_organization', 'user.create_trips', 'user.view_reports']
            },
            response_only=True
        )
    ]
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """
    Vráti štatistiky používateľa.
    
    Obsahuje základné informácie o aktivite používateľa v systéme.
    """
    user = request.user
    
    user_groups = user.groups.all()
    
    stats = {
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'is_organization_admin': user.is_organization_admin,
        'organization': user.organization_name,
        'organization_type': user.get_organization_type(),
        'date_joined': user.date_joined,
        'last_login': user.last_login,
        'is_active': user.is_active,
        'position': user.position,
        'phone': user.phone,
        'groups': [group.name for group in user_groups],
        'group_ids': [group.id for group in user_groups],
        'permissions': list(user.get_all_permissions()),
    }
    
    return Response(stats)