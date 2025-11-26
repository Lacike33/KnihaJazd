"""
URL konfigurácia pre API verziu 1.

Obsahuje všetky endpointy pre v1 API vrátane dashboard, 
users, organizations a budúcich modulov.
"""

from django.urls import path, include

app_name = 'v1'

urlpatterns = [
    # Dashboard endpoints
    path('dashboard/', include('dashboard.urls', namespace='dashboard')),
    
    # User management a autentifikácia
    path('users/', include('user.urls', namespace='user')),
    
    # Organizácie
    path('organizations/', include('organization.urls', namespace='organization')),
    
    # Budúce moduly:
    # path('vehicles/', include('vehicle.urls', namespace='vehicles')),
    # path('trips/', include('trip.urls', namespace='trips')),
    # path('drivers/', include('driver.urls', namespace='drivers')),
    # path('reports/', include('report.urls', namespace='reports')),
]