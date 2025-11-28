"""
Django admin konfigurácia pre user aplikáciu.

Obsahuje admin interface pre CustomUser model s podporou vytvárania
a editovania používateľov vrátane správnej organizácie management.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from .models import CustomUser
from organization.models import Organization


class CustomUserCreationForm(UserCreationForm):
    """
    Formulár pre vytváranie nových používateľov v admin.
    
    Rozširuje štandardný UserCreationForm o organization field
    a ďalšie custom polia.
    """
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'organization', 'is_organization_admin')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Voliteľné pole organizácie pre admin
        self.fields['organization'].required = False
        self.fields['organization'].help_text = (
            "Ak nevyberiete organizáciu a nastavíte 'Is organization admin' na True, "
            "automaticky sa vytvorí nová organizácia."
        )


class CustomUserChangeForm(UserChangeForm):
    """
    Formulár pre editovanie existujúcich používateľov v admin.
    """
    
    class Meta:
        model = CustomUser
        fields = '__all__'


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    """
    Admin interface pre CustomUser model.
    
    Umožňuje vytváranie a editovanie používateľov s podporou
    organization management a custom polí.
    """
    
    # Formuláre
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    
    # Zobrazenie v zozname
    list_display = [
        'username',
        'email', 
        'first_name',
        'last_name',
        'get_organization_name',
        'is_organization_admin',
        'is_active',
        'is_staff',
        'date_joined'
    ]
    
    list_filter = [
        'is_active',
        'is_staff',
        'is_superuser',
        'is_organization_admin',
        'organization__organization_type',
        'date_joined'
    ]
    
    search_fields = [
        'username',
        'email',
        'first_name', 
        'last_name',
        'organization__name'
    ]
    
    # Detail view - rozšírené fieldsets
    fieldsets = (
        ('Základné informácie', {
            'fields': ('username', 'password', 'email')
        }),
        ('Osobné údaje', {
            'fields': ('first_name', 'last_name', 'phone', 'position')
        }),
        ('Organizácia', {
            'fields': ('organization', 'is_organization_admin'),
            'description': 'Organizácia a admin práva používateľa'
        }),
        ('Oprávnenia', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Dôležité dátumy', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    # Fieldsets pre vytváranie nového používateľa
    add_fieldsets = (
        ('Základné informácie', {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2')
        }),
        ('Osobné údaje', {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'phone', 'position')
        }),
        ('Organizácia', {
            'classes': ('wide',),
            'fields': ('organization', 'is_organization_admin'),
            'description': (
                'Ak nevyberiete organizáciu a nastavíte "Is organization admin" na True, '
                'automaticky sa vytvorí nová organizácia s menom používateľa.'
            )
        }),
        ('Oprávnenia', {
            'classes': ('wide',),
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
    )
    
    readonly_fields = ['last_login', 'date_joined']
    
    # Custom metódy pre zobrazenie
    def get_organization_name(self, obj):
        """Vráti názov organizácie používateľa."""
        return obj.organization.name if obj.organization else "Žiadna"
    get_organization_name.short_description = 'Organizácia'
    get_organization_name.admin_order_field = 'organization__name'
    
    def get_queryset(self, request):
        """Optimalizované query s select_related pre organizácie."""
        return super().get_queryset(request).select_related('organization')
    
    def save_model(self, request, obj, form, change):
        """
        Custom save metóda pre správne spracovanie organizácií.
        
        Ak admin vytvorí používateľa bez organizácie ale s is_organization_admin=True,
        signal automaticky vytvorí novú organizáciu.
        """
        super().save_model(request, obj, form, change)
        
        # Log pre admin akcie
        if not change:  # Nový používateľ
            if obj.organization:
                self.message_user(
                    request, 
                    f"Používateľ {obj.username} bol pridaný do organizácie {obj.organization.name}"
                )
            elif obj.is_organization_admin:
                self.message_user(
                    request,
                    f"Pre používateľa {obj.username} bola vytvorená nová organizácia"
                )
