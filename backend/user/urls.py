"""
URL konfigurácia pre user aplikáciu.

Obsahuje endpointy pre autentifikáciu, registráciu,
správu používateľských profilov a organizačných pozývanie.
"""

from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from . import views

app_name = 'user'

urlpatterns = [
    # JWT Authentication endpoints
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    
    # User/Me endpoints
    path('me/', views.UserMeView.as_view(), name='user_me'),
    path('me/stats/', views.user_stats, name='user_stats'),
    path('me/change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # User management
    path('', views.UserListView.as_view(), name='user_list'),
    path('<int:user_id>/', views.UserDetailView.as_view(), name='user_detail'),
    
    # Budúce endpointy pre user management:
    # path('invite/', views.InviteUserView.as_view(), name='invite'),
    # path('invite/accept/<str:token>/', views.AcceptInviteView.as_view(), name='accept_invite'),
]