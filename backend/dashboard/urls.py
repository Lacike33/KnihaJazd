"""
URL konfigurácia pre dashboard aplikáciu.

Obsahuje endpointy pre získavanie štatistík, grafov
a súhrnných informácií pre dashboard používateľa.
"""

from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    # Aktuálne dostupné endpointy
    path('stats/', views.dashboard_stats, name='dashboard_stats'),
    
    # Budúce endpointy pre dashboard:
    # path('charts/trips/', views.TripsChartView.as_view(), name='trips_chart'),
    # path('charts/distance/', views.DistanceChartView.as_view(), name='distance_chart'),
    # path('charts/vehicles/', views.VehiclesChartView.as_view(), name='vehicles_chart'),
    # path('summary/', views.DashboardSummaryView.as_view(), name='dashboard_summary'),
    # path('recent-activity/', views.RecentActivityView.as_view(), name='recent_activity'),
]