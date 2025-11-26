"""
Serializers pre user aplikáciu.

Obsahuje serializers pre CustomUser model, registráciu,
profily a správu hesiel.
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """
    Základný serializer pre CustomUser model.
    
    Používa sa pre zoznamy používateľov a základné operácie.
    """
    organization_name = serializers.CharField(read_only=True)
    organization_type = serializers.CharField(source='get_organization_type', read_only=True)
    groups = serializers.SerializerMethodField()
    group_ids = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_active', 'is_organization_admin', 'position', 'phone',
            'date_joined', 'last_login', 'organization_name', 'organization_type',
            'groups', 'group_ids'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def get_groups(self, obj):
        """Vráti názvy skupín (Django štandard)."""
        return [group.name for group in obj.groups.all()]
    
    def get_group_ids(self, obj):
        """Vráti technické ID skupín pre API integrácie."""
        return [group.id for group in obj.groups.all()]


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Detailný serializer pre používateľský profil.
    
    Používa sa pre zobrazenie a editáciu profilu používateľa.
    Obsahuje dodatočné polia a validácie.
    """
    organization_name = serializers.CharField(read_only=True)
    organization_type = serializers.CharField(source='get_organization_type', read_only=True)
    can_manage_organization = serializers.BooleanField(read_only=True)
    groups = serializers.SerializerMethodField()
    group_ids = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_active', 'is_organization_admin', 'position', 'phone',
            'date_joined', 'last_login', 'organization_name', 'organization_type',
            'can_manage_organization', 'groups', 'group_ids', 'permissions'
        ]
        read_only_fields = [
            'id', 'username', 'date_joined', 'last_login', 'is_active',
            'is_organization_admin'
        ]
    
    def get_groups(self, obj):
        """Vráti názvy skupín (Django štandard)."""
        return [group.name for group in obj.groups.all()]
    
    def get_group_ids(self, obj):
        """Vráti technické ID skupín pre API integrácie."""
        return [group.id for group in obj.groups.all()]
    
    def get_permissions(self, obj):
        """Vráti zoznam všetkých permissions používateľa."""
        return list(obj.get_all_permissions())
    
    def validate_email(self, value):
        """Validácia unique email pri aktualizácii."""
        user = self.instance
        if user and CustomUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Používateľ s týmto emailom už existuje.")
        return value


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer pre registráciu nového používateľa.
    
    Obsahuje validáciu hesla a dodatočné polia potrebné pre registráciu.
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'position', 'phone'
        ]
    
    def validate(self, attrs):
        """Validácia že sa heslá zhodujú."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password_confirm": "Heslá sa nezhodujú."}
            )
        return attrs
    
    def validate_email(self, value):
        """Validácia unique email."""
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Používateľ s týmto emailom už existuje.")
        return value
    
    def validate_username(self, value):
        """Validácia unique username."""
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Používateľ s týmto používateľským menom už existuje.")
        return value
    
    def create(self, validated_data):
        """Vytvorí nového používateľa s hash-ovaným heslom."""
        # Odstráni password_confirm z validated_data
        validated_data.pop('password_confirm')
        
        # Vytvorí používateľa s hash-ovaným heslom
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(password=password, **validated_data)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer pre zmenu hesla.
    
    Validuje staré heslo a nastaví nové heslo.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        """Validácia že sa nové heslá zhodujú."""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {"new_password_confirm": "Nové heslá sa nezhodujú."}
            )
        return attrs


class UserStatsSerializer(serializers.Serializer):
    """
    Serializer pre používateľské štatistiky.
    
    Read-only serializer pre zobrazenie štatistík používateľa.
    """
    user_id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    is_organization_admin = serializers.BooleanField(read_only=True)
    organization = serializers.CharField(read_only=True)
    organization_type = serializers.CharField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
    last_login = serializers.DateTimeField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    position = serializers.CharField(read_only=True)
    phone = serializers.CharField(read_only=True)
    groups = serializers.ListField(read_only=True)      # Group names
    group_ids = serializers.ListField(read_only=True)  # Group IDs
    permissions = serializers.ListField(read_only=True)