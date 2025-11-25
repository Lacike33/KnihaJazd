"""
Business logika pre dashboard aplikáciu.

Obsahuje všetky služby (services) pre spracovanie dát a biznis logiky
súvisiacej s dashboard funkcionalitou. Oddeľuje biznis logiku od views.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any
from django.utils import timezone


class DashboardService:
    """
    Služba pre spracovanie dát a výpočty súvisiace s dashboard.
    
    Obsahuje statické metódy pre získavanie štatistík, výpočty
    a transformáciu dát pre dashboard používateľa.
    """
    
    @staticmethod
    def get_user_dashboard_stats(user=None) -> Dict[str, Any]:
        """
        Získa kompletné štatistiky pre dashboard používateľa.
        
        Args:
            user: Django User objekt (momentálne nepoužívané pre mock data)
            
        Returns:
            Dict obsahujúci všetky štatistiky pre dashboard
        """
        today = timezone.now().date()
        
        # Získanie základných štatistík
        trip_stats = DashboardService._get_trip_statistics(user)
        distance_stats = DashboardService._get_distance_statistics(user)  
        vehicle_stats = DashboardService._get_vehicle_statistics(user)
        vehicle_info = DashboardService._get_current_vehicle_info(user)
        recent_trips = DashboardService._get_recent_trips(user, limit=3)
        
        # Kombinovanie všetkých štatistík - camelCase názvy
        dashboard_data = {
            **trip_stats,
            **distance_stats,
            **vehicle_stats,
            'lastTripDate': DashboardService._get_last_trip_date(user),
            'currentVehicle': vehicle_info,
            'recentTrips': recent_trips
        }
        
        return dashboard_data
    
    @staticmethod
    def _get_trip_statistics(user=None) -> Dict[str, int]:
        """
        Vypočíta štatistiky súvisiace s počtom jázd.
        
        Args:
            user: Django User objekt pre filtrovanie jázd
            
        Returns:
            Dict obsahujúci počty jázd v rôznych kategóriách
        """
        # TODO: MOCK DATA - pri zapojení DB a reálnych dát bude treba mocky prerobi
        # V reálnej aplikácii:
        # from django.utils import timezone
        # from dateutil.relativedelta import relativedelta
        # from trips.models import Trip
        #
        # current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # user_trips = Trip.objects.filter(user=user)
        # 
        # total_trips = user_trips.count()
        # this_month_trips = user_trips.filter(date__gte=current_month_start).count()
        # pending_trips = user_trips.filter(status='pending').count()
        # completed_trips = user_trips.filter(status='completed').count()
        
        return {
            'totalTrips': 24,
            'thisMonthTrips': 8,
            'pendingTrips': 3,
            'completedTrips': 21
        }
    
    @staticmethod
    def _get_distance_statistics(user=None) -> Dict[str, float]:
        """
        Vypočíta štatistiky súvisiace so vzdialenosťami.
        
        Args:
            user: Django User objekt pre filtrovanie jázd
            
        Returns:
            Dict obsahujúci vzdialenosti v rôznych kategóriách
        """
        # TODO: MOCK DATA - pri zapojení DB a reálnych dát bude treba mocky prerobi
        # V reálnej aplikácii:
        # from django.db import models
        # from django.utils import timezone
        # from trips.models import Trip
        #
        # current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # user_trips = Trip.objects.filter(user=user)
        #
        # total_distance = user_trips.aggregate(
        #     total=models.Sum('distance')
        # )['total'] or 0.0
        #
        # business_distance = user_trips.filter(
        #     purpose__in=['služobná cesta', 'obchodná cesta', 'meeting']
        # ).aggregate(
        #     total=models.Sum('distance')
        # )['total'] or 0.0
        #
        # this_month_distance = user_trips.filter(
        #     date__gte=current_month_start
        # ).aggregate(
        #     total=models.Sum('distance')
        # )['total'] or 0.0
        
        return {
            'totalKm': 1247.5,
            'businessKm': 678.9,
            'thisMonthDistance': 325.2
        }
    
    @staticmethod
    def _get_vehicle_statistics(user=None) -> Dict[str, int]:
        """
        Vypočíta štatistiky súvisiace s vozidlami používateľa.
        
        Args:
            user: Django User objekt pre filtrovanie vozidiel
            
        Returns:
            Dict obsahujúci počty vozidiel v rôznych kategóriách
        """
        # TODO: MOCK DATA - pri zapojení DB a reálnych dát bude treba mocky prerobi
        # V reálnej aplikácii:
        # from vehicles.models import Vehicle
        #
        # user_vehicles = Vehicle.objects.filter(user=user)
        # total_vehicles = user_vehicles.count()
        # active_vehicles = user_vehicles.filter(is_active=True).count()
        # owned_vehicles = user_vehicles.filter(ownership_type='owned').count()
        # company_vehicles = user_vehicles.filter(ownership_type='company').count()
        
        return {
            'totalVehicles': 3,
            'activeVehicles': 2,
            'ownedVehicles': 1,
            'companyVehicles': 2
        }
    
    @staticmethod
    def _get_current_vehicle_info(user=None) -> Dict[str, Any]:
        """
        Získa informácie o aktuálne používanom vozidle.
        
        Args:
            user: Django User objekt pre filtrovanie vozidiel
            
        Returns:
            Dict obsahujúci informácie o vozidle
        """
        # TODO: MOCK DATA - pri zapojení DB a reálnych dát bude treba mocky prerobi
        # V reálnej aplikácii:
        # from vehicles.models import Vehicle
        #
        # current_vehicle = Vehicle.objects.filter(
        #     user=user, 
        #     is_active=True, 
        #     is_primary=True
        # ).first()
        #
        # if not current_vehicle:
        #     current_vehicle = Vehicle.objects.filter(user=user, is_active=True).first()
        #
        # return {
        #     'id': current_vehicle.id,
        #     'name': f"{current_vehicle.brand} {current_vehicle.model}",
        #     'plateNumber': current_vehicle.license_plate,
        #     'currentKm': current_vehicle.current_odometer
        # } if current_vehicle else None
        
        return {
            'id': 1,
            'name': 'Škoda Octavia',
            'plateNumber': 'BA 123 AB',
            'currentKm': 45678
        }
    
    @staticmethod
    def _get_recent_trips(user=None, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Získa zoznam posledných jázd používateľa.
        
        Args:
            user: Django User objekt pre filtrovanie jázd
            limit: Maximálny počet jázd na vrátenie
            
        Returns:
            List obsahujúci slovníky s informáciami o jazdách
        """
        today = timezone.now().date()
        
        # TODO: MOCK DATA - pri zapojení DB a reálnych dát bude treba mocky prerobi
        # V reálnej aplikácii:
        # from trips.models import Trip
        # 
        # recent_trips = Trip.objects.filter(user=user).select_related(
        #     'vehicle'
        # ).order_by('-created_at')[:limit]
        #
        # return [
        #     {
        #         'id': trip.id,
        #         'date': trip.date,
        #         'startLocation': trip.start_location,
        #         'endLocation': trip.end_location,
        #         'distance': float(trip.distance),
        #         'purpose': trip.purpose,
        #         'status': trip.status,
        #         'vehicleName': f"{trip.vehicle.brand} {trip.vehicle.model}",
        #         'odometerStart': trip.odometer_start,
        #         'odometerEnd': trip.odometer_end,
        #     }
        #     for trip in recent_trips
        # ]
        
        mock_trips = [
            {
                'id': 1,
                'date': (today - timedelta(days=1)),
                'startLocation': 'Bratislava',
                'endLocation': 'Košice',
                'distance': 356.2,
                'purpose': 'Služobná cesta',
                'status': 'completed'
            },
            {
                'id': 2,
                'date': (today - timedelta(days=2)),
                'startLocation': 'Košice',
                'endLocation': 'Prešov',
                'distance': 89.7,
                'purpose': 'Návšteva klienta',
                'status': 'completed'
            },
            {
                'id': 3,
                'date': today,
                'startLocation': 'Bratislava',
                'endLocation': 'Trnava',
                'distance': 47.2,
                'purpose': 'Služobná cesta',
                'status': 'pending'
            }
        ]
        
        return mock_trips[:limit]
    
    @staticmethod
    def _get_last_trip_date(user=None):
        """
        Získa dátum poslednej jazdy používateľa.
        
        Args:
            user: Django User objekt pre filtrovanie jázd
            
        Returns:
            Date objekt alebo None ak nemá žiadne jazdy
        """
        today = timezone.now().date()
        
        # TODO: MOCK DATA - pri zapojení DB a reálnych dát bude treba mocky prerobi
        # V reálnej aplikácii:
        # from trips.models import Trip
        #
        # last_trip = Trip.objects.filter(user=user).order_by('-date').first()
        # return last_trip.date if last_trip else None
        
        return today - timedelta(days=2)
    
    @staticmethod
    def _serialize_trip(trip) -> Dict[str, Any]:
        """
        Transformuje Trip model objekt do slovníka pre camelCase response.
        
        Args:
            trip: Trip model objekt z databázy
            
        Returns:
            Dict reprezentujúci jazdu v camelCase formáte
        """
        # TODO: MOCK DATA - toto sa používa len pre reálne Django model objekty
        # V reálnej aplikácii by to vyzeralo presne takto:
        return {
            'id': trip.id,
            'date': trip.date,
            'startLocation': trip.start_location,
            'endLocation': trip.end_location,
            'distance': float(trip.distance),
            'purpose': trip.purpose,
            'status': trip.status,
            'vehicleName': f"{trip.vehicle.brand} {trip.vehicle.model}" if trip.vehicle else None,
            'odometerStart': trip.odometer_start,
            'odometerEnd': trip.odometer_end,
            'createdAt': trip.created_at,
            'updatedAt': trip.updated_at
        }