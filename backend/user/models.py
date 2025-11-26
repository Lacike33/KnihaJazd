"""
Modely pre user aplikáciu.

Obsahuje CustomUser model s naviazaním na Organization model.
Spravuje autentifikáciu, používateľské práva a profily.
Používa Django Groups & Permissions pre komplexnú správu rolí.
"""

from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class CustomUser(AbstractUser):
    """
    Rozšírený Django User model s naviazaním na organizáciu.
    
    Každý používateľ patrí do jednej organizácie. Pri registrácii sa automaticky
    vytvorí nová organizácia a používateľ sa nastaví ako jej admin.
    
    Používa email ako USERNAME_FIELD pre prihlásenie.
    """
    
    # DÔLEŽITÉ: Email ako username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Dodatočné polia pre createsuperuser
    
    # Prepísanie email fieldu aby bol unique
    email = models.EmailField(
        unique=True,
        verbose_name="Email",
        help_text="Email adresa používateľa (používa sa na prihlásenie)"
    )
    
    organization = models.ForeignKey(
        'organization.Organization',  # String reference to avoid circular import
        on_delete=models.CASCADE,
        related_name='users',
        null=True,
        blank=True,
        verbose_name="Organizácia",
        help_text="Organizácia ku ktorej používateľ patrí"
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Telefón",
        help_text="Telefónne číslo používateľa"
    )
    
    is_organization_admin = models.BooleanField(
        default=True,
        verbose_name="Admin organizácie",
        help_text="Označuje či má používateľ admin práva v organizácii"
    )
    
    # Dodatočné polia pre lepšiu identifikáciu
    position = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Pozícia",
        help_text="Pracovná pozícia v organizácii"
    )
    
    class Meta:
        verbose_name = "Používateľ"
        verbose_name_plural = "Používatelia"
        permissions = [
            # Organizácia permissions
            ('manage_organization', 'Môže spravovať organizáciu'),
            ('view_organization_stats', 'Môže zobrazovať štatistiky organizácie'),
            ('manage_organization_users', 'Môže spravovať používateľov organizácie'),
            
            # Vozidlá permissions (pre budúcnosť)
            ('manage_vehicles', 'Môže spravovať vozidlá'),
            ('drive_vehicles', 'Môže voziť vozidlá'),
            ('view_vehicle_reports', 'Môže zobrazovať výkazy vozidiel'),
            
            # Jazdy permissions
            ('create_trips', 'Môže vytvárať jazdy'),
            ('edit_own_trips', 'Môže editovať vlastné jazdy'),
            ('edit_all_trips', 'Môže editovať všetky jazdy'),
            ('delete_trips', 'Môže mazať jazdy'),
            ('approve_trips', 'Môže schvaľovať jazdy'),
            
            # Výkazy permissions  
            ('view_reports', 'Môže zobrazovať výkazy'),
            ('generate_reports', 'Môže generovať výkazy'),
            ('export_reports', 'Môže exportovať výkazy'),
            
            # Účtovníctvo permissions
            ('manage_accounting', 'Môže spravovať účtovníctvo'),
            ('view_financial_data', 'Môže zobrazovať finančné dáta'),
            ('manage_expenses', 'Môže spravovať výdavky'),
            
            # Admin permissions
            ('access_admin_panel', 'Môže pristupovať k admin panelu'),
            ('manage_system_settings', 'Môže spravovať systémové nastavenia'),
        ]
    
    def __str__(self):
        if self.organization:
            return f"{self.get_full_name()} ({self.organization.name})"
        return self.get_full_name() or self.username
    
    @property
    def can_manage_organization(self):
        """Vráti True ak môže používateľ spravovať organizáciu."""
        return self.is_organization_admin or self.is_superuser
    
    @property
    def organization_name(self):
        """Vráti názov organizácie alebo prázdny string."""
        return self.organization.name if self.organization else ""
    
    def get_organization_type(self):
        """Vráti typ organizácie používateľa."""
        if self.organization:
            return self.organization.organization_type
        return None
    
    def is_client_user(self):
        """Vráti True ak používateľ patrí do client organizácie."""
        return self.organization and self.organization.is_client
    
    def is_partner_user(self):
        """Vráti True ak používateľ patrí do partner organizácie."""
        return self.organization and self.organization.is_partner
    
    # Groups & Permissions helper methods
    def is_admin(self):
        """Vráti True ak má používateľ admin skupinu."""
        return self.groups.filter(name='Administrátori').exists()
    
    def is_driver(self):
        """Vráti True ak má používateľ vodič skupinu."""
        return self.groups.filter(name='Vodiči').exists()
    
    def is_accountant(self):
        """Vráti True ak má používateľ účtovník skupinu."""
        return self.groups.filter(name='Účtovníci').exists()
    
    def get_primary_role(self):
        """Vráti primárnu rolu používateľa (prvú skupinu)."""
        first_group = self.groups.first()
        return first_group.name if first_group else 'Používateľ'
    
    def get_all_roles(self):
        """Vráti zoznam všetkých rolí/skupín používateľa."""
        return [group.name for group in self.groups.all()]
    
    def has_organization_permission(self, permission_codename):
        """Skontroluje oprávnenie pre organizačné akcie."""
        return self.has_perm(f'user.{permission_codename}')
    
    def can_manage_trips(self):
        """Môže spravovať jazdy."""
        return self.has_organization_permission('edit_all_trips') or self.has_organization_permission('delete_trips')
    
    def can_view_financials(self):
        """Môže zobrazovať finančné dáta."""
        return self.has_organization_permission('view_financial_data') or self.has_organization_permission('manage_accounting')
    
    def can_drive_vehicles(self):
        """Môže voziť vozidlá."""
        return self.has_organization_permission('drive_vehicles') or self.is_driver()
    
    def can_access_admin_features(self):
        """Môže pristupovať k admin funkciám."""
        return (self.has_organization_permission('access_admin_panel') 
                or self.is_organization_admin 
                or self.is_superuser)
    
    def assign_role(self, role_name):
        """Prideľí používateľovi rolu (skupinu)."""
        try:
            group = Group.objects.get(name=role_name)
            self.groups.add(group)
            return True
        except Group.DoesNotExist:
            return False
    
    def remove_role(self, role_name):
        """Odstráni používateľovi rolu (skupinu)."""
        try:
            group = Group.objects.get(name=role_name)
            self.groups.remove(group)
            return True
        except Group.DoesNotExist:
            return False
