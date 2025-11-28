"""
URL konfigurácia pre organization aplikáciu.

Obsahuje endpointy pre správu organizácií vrátane detailov,
editovania a získavania organizačných štatistík.
"""

from django.urls import path
from . import views

app_name = 'organization'

urlpatterns = [
    # Organization management
    path('', views.OrganizationListView.as_view(), name='organization_list'),
    path('detail/', views.OrganizationDetailView.as_view(), name='organization_detail'),
    path('stats/', views.organization_stats, name='organization_stats'),
    path('users/', views.organization_users, name='organization_users'),
    path('toggle-status/', views.toggle_organization_status, name='toggle_status'),
    
    # Budúce endpointy pre organizácie:
    # path('<int:pk>/invite/', views.InviteUserView.as_view(), name='invite'),
]