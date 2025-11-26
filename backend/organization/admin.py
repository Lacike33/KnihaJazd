"""
Django admin konfigurácia pre organization aplikáciu.

Obsahuje admin interface pre Organization model s obmedzeným vytváraním -
organizácie sa vytvárajú automaticky cez signals, nie manuálne v admin.
"""

from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Organization

User = get_user_model()


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    """
    Admin interface pre Organization model.
    
    OBMEDZENIA:
    - Nie je možné vytvárať organizácie manuálne (len editovanie existujúcich)
    - Organizácie sa vytvárajú automaticky cez signals pri registrácii admin používateľov
    """
    
    # Zobrazenie v zozname
    list_display = [
        'name', 
        'organization_type', 
        'email',
        'get_users_count',
        'get_vehicles_count', 
        'is_active',
        'created_at'
    ]
    
    list_filter = [
        'organization_type',
        'is_active',
        'created_at'
    ]
    
    search_fields = [
        'name',
        'email',
        'ico',
        'dic'
    ]
    
    # Detail view
    fieldsets = (
        ('Základné informácie', {
            'fields': ('name', 'organization_type', 'is_active')
        }),
        ('Identifikačné údaje', {
            'fields': ('ico', 'dic'),
            'classes': ('collapse',)
        }),
        ('Kontaktné údaje', {
            'fields': ('email', 'phone', 'address')
        }),
        ('Systémové informácie', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    # DÔLEŽITÉ: Zakázanie vytvárania nových organizácií
    def has_add_permission(self, request):
        """
        Zakáže vytváranie organizácií cez admin.
        
        Organizácie sa vytvárajú automaticky pri registrácii admin používateľov
        cez signals, nie manuálne v admin interface.
        """
        return False
    
    def get_users_count(self, obj):
        """Vráti počet používateľov v organizácii."""
        return obj.get_active_users_count()
    get_users_count.short_description = 'Používatelia'
    get_users_count.admin_order_field = 'users__count'
    
    def get_vehicles_count(self, obj):
        """Vráti počet vozidiel organizácie."""
        return obj.get_vehicles_count()
    get_vehicles_count.short_description = 'Vozidlá'
