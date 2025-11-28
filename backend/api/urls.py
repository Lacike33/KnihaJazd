"""
Hlavný API URL router pre všetky verzie API.

Spravuje routing medzi rôznymi verziami API (v1, v2, atď.)
a zabezpečuje správnu štruktúru pre API versioning.
"""

from django.urls import path, include

urlpatterns = [
    # API Version 1 - Aktuálna verzia
    path('v1/', include('api.v1.urls', namespace='v1')),
    
    # Budúce verzie API:
    # path('v2/', include('api.v2.urls', namespace='v2')),
    # path('v3/', include('api.v3.urls', namespace='v3')),
]