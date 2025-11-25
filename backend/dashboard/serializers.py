"""
Serializers pre dashboard aplikáciu.

Obsahuje všetky serializers pre validáciu, transformáciu a dokumentáciu 
API endpointov súvisiacich s dashboard funkcionalitou.
"""

from rest_framework import serializers


class VehicleSerializer(serializers.Serializer):
    """
    Serializer pre zobrazenie základných informácií o vozidle.
    Používa camelCase naming convention.
    """
    id = serializers.IntegerField(
        help_text="Jedinečný identifikátor vozidla"
    )
    name = serializers.CharField(
        max_length=100, 
        help_text="Názov vozidla (napr. Škoda Octavia)"
    )
    plateNumber = serializers.CharField(
        max_length=20, 
        help_text="Evidenčné číslo vozidla (napr. BA 123 AB)"
    )
    currentKm = serializers.IntegerField(
        help_text="Aktuálny stav kilometrov na vozidle"
    )


class TripSerializer(serializers.Serializer):
    """
    Serializer pre zobrazenie základných informácií o jazde.
    Používa camelCase naming convention.
    """
    id = serializers.IntegerField(
        help_text="Jedinečný identifikátor jazdy"
    )
    date = serializers.DateField(
        help_text="Dátum jazdy vo formáte YYYY-MM-DD"
    )
    startLocation = serializers.CharField(
        max_length=200, 
        help_text="Miesto začiatku jazdy"
    )
    endLocation = serializers.CharField(
        max_length=200, 
        help_text="Miesto ukončenia jazdy"
    )
    distance = serializers.FloatField(
        help_text="Vzdialenosť jazdy v kilometroch"
    )
    purpose = serializers.CharField(
        max_length=200, 
        help_text="Účel jazdy (služobná cesta, návšteva klienta, atď.)"
    )
    status = serializers.ChoiceField(
        choices=['completed', 'pending', 'draft'],
        help_text="Stav jazdy: completed (dokončená), pending (čaká na spracovanie), draft (koncept)"
    )


class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer pre zobrazenie štatistík na dashboard používateľa.
    
    Obsahuje súhrné informácie o jazdách, celkových vzdialenostiach,
    aktuálnom vozidle a posledných jazdách používateľa.
    
    Používa camelCase naming convention pre konzistenciu s frontend JavaScript konvenciami.
    """
    
    # Celkové štatistiky jázd - camelCase názvy
    totalTrips = serializers.IntegerField(
        help_text="Celkový počet všetkých jázd používateľa"
    )
    thisMonthTrips = serializers.IntegerField(
        help_text="Počet jázd v aktuálnom mesiaci"
    )
    
    # Štatistiky vozidiel - camelCase názvy
    totalVehicles = serializers.IntegerField(
        help_text="Celkový počet vozidiel používateľa"
    )
    activeVehicles = serializers.IntegerField(
        help_text="Počet aktívnych vozidiel"
    )
    ownedVehicles = serializers.IntegerField(
        help_text="Počet vlastných vozidiel"
    )
    companyVehicles = serializers.IntegerField(
        help_text="Počet firemných vozidiel"
    )
    
    # Štatistiky vzdialeností - camelCase názvy
    totalKm = serializers.FloatField(
        help_text="Celková vzdialenosť všetkých jázd v kilometroch"
    )
    businessKm = serializers.FloatField(
        help_text="Vzdialenosť služobných jázd v kilometroch"
    )
    thisMonthDistance = serializers.FloatField(
        help_text="Vzdialenosť jázd v aktuálnom mesiaci v kilometroch"
    )
    
    # Dodatočné informácie - camelCase názvy
    lastTripDate = serializers.DateField(
        help_text="Dátum poslednej jazdy vo formáte YYYY-MM-DD",
        allow_null=True
    )
    pendingTrips = serializers.IntegerField(
        help_text="Počet jázd čakajúcich na spracovanie"
    )
    completedTrips = serializers.IntegerField(
        help_text="Počet dokončených jázd"
    )
    
    # Informácie o aktuálnom vozidle - camelCase názvy
    currentVehicle = VehicleSerializer(
        help_text="Informácie o aktuálne používanom vozidle"
    )
    
    # Posledné jazdy - camelCase názvy
    recentTrips = TripSerializer(
        many=True, 
        help_text="Zoznam posledných jázd (max 5)"
    )
    
    def validate_totalTrips(self, value):
        """
        Validácia celkového počtu jázd - musí byť nezáporné číslo.
        """
        if value < 0:
            raise serializers.ValidationError("Počet jázd nemôže byť záporný")
        return value
    
    def validate_totalDistance(self, value):
        """
        Validácia celkovej vzdialenosti - musí byť nezáporné číslo.
        """
        if value < 0:
            raise serializers.ValidationError("Vzdialenosť nemôže byť záporná")
        return value


class DashboardResponseSerializer(serializers.Serializer):
    """
    Wrapper serializer pre štandardný response format API.
    
    Zabaľuje všetky data do 'data' objektu pre konzistenciu API responses.
    """
    data = DashboardStatsSerializer(
        help_text="Objekt obsahujúci všetky dashboard štatistiky"
    )