"""
Serializers pre organization aplikáciu.

Obsahuje serializers pre Organization model, štatistiky
a správu organizácií.
"""

from rest_framework import serializers
from .models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    """
    Základný serializer pre Organization model.
    
    Používa sa pre zoznamy organizácií a základné operácie.
    """
    organization_type_display = serializers.CharField(
        source='get_organization_type_display', 
        read_only=True
    )
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'organization_type', 'organization_type_display',
            'ico', 'dic', 'address', 'email', 'phone', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_ico(self, value):
        """Validácia IČO formátu."""
        if value and len(value) < 6:
            raise serializers.ValidationError("IČO musí mať minimálne 6 znakov.")
        return value
    
    def validate_email(self, value):
        """Validácia unique email pre organizácie."""
        organization = self.instance
        if value and organization:
            if Organization.objects.exclude(pk=organization.pk).filter(email=value).exists():
                raise serializers.ValidationError("Organizácia s týmto emailom už existuje.")
        elif value:
            if Organization.objects.filter(email=value).exists():
                raise serializers.ValidationError("Organizácia s týmto emailom už existuje.")
        return value


class OrganizationDetailSerializer(serializers.ModelSerializer):
    """
    Detailný serializer pre Organization model.
    
    Používa sa pre zobrazenie detailov organizácie s dodatočnými
    vypočítanými poliami a štatistikami.
    """
    organization_type_display = serializers.CharField(
        source='get_organization_type_display', 
        read_only=True
    )
    is_client = serializers.BooleanField(read_only=True)
    is_partner = serializers.BooleanField(read_only=True)
    active_users_count = serializers.SerializerMethodField()
    vehicles_count = serializers.SerializerMethodField()
    trips_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'organization_type', 'organization_type_display',
            'ico', 'dic', 'address', 'email', 'phone', 'is_active',
            'is_client', 'is_partner', 'active_users_count', 'vehicles_count',
            'trips_count', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'is_client', 'is_partner',
            'active_users_count', 'vehicles_count', 'trips_count'
        ]
    
    def get_active_users_count(self, obj):
        """Vráti počet aktívnych používateľov."""
        return obj.get_active_users_count()
    
    def get_vehicles_count(self, obj):
        """Vráti počet vozidiel."""
        return obj.get_vehicles_count()
    
    def get_trips_count(self, obj):
        """Vráti počet jázd."""
        return obj.get_trips_count()


class OrganizationStatsSerializer(serializers.Serializer):
    """
    Serializer pre organizačné štatistiky.
    
    Read-only serializer pre zobrazenie komplexných štatistík organizácie.
    """
    organization_id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)
    organization_type = serializers.CharField(read_only=True)
    organization_type_display = serializers.CharField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_client = serializers.BooleanField(read_only=True)
    is_partner = serializers.BooleanField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    ico = serializers.CharField(read_only=True)
    dic = serializers.CharField(read_only=True)
    active_users_count = serializers.IntegerField(read_only=True)
    vehicles_count = serializers.IntegerField(read_only=True)
    trips_count = serializers.IntegerField(read_only=True)


class OrganizationListSerializer(serializers.ModelSerializer):
    """
    Zjednodušený serializer pre zoznamy organizácií.
    
    Obsahuje iba základné informácie pre optimálne zobrazenie v zoznamoch.
    """
    organization_type_display = serializers.CharField(
        source='get_organization_type_display', 
        read_only=True
    )
    active_users_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'organization_type', 'organization_type_display',
            'is_active', 'active_users_count', 'created_at'
        ]
    
    def get_active_users_count(self, obj):
        """Vráti počet aktívnych používateľov."""
        return obj.get_active_users_count()