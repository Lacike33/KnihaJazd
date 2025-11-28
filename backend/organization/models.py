"""
Modely pre organization aplikáciu.

Obsahuje Organization model ako základnú entitu, na ktorú sú naviazané
všetky ostatné dáta v systéme (vozidlá, vodiči, jazdy).
"""

from django.db import models
from django.utils import timezone


class Organization(models.Model):
    """
    Základná entita systému - organizácia (klient alebo partner).
    
    Všetky dáta v systéme (vozidlá, vodiči, jazdy) sú naviazané na túto entitu
    pre zabezpečenie jasnej separácie dát medzi rôznymi organizáciami.
    """

    ORGANIZATION_TYPES = [
        ('client', 'Klient'),
        ('partner', 'Partner'),
    ]

    # Základné informácie
    name = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name="Názov organizácie",
        help_text="Názov firmy, SZCO alebo organizácie"
    )

    organization_type = models.CharField(
        max_length=20,
        choices=ORGANIZATION_TYPES,
        default='client',
        verbose_name="Typ organizácie",
        help_text="Client (platí za služby) alebo Partner (poskytuje služby)"
    )

    # Identifikačné údaje
    ico = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="IČO",
        help_text="Identifikačné číslo organizácie"
    )

    dic = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="DIČ",
        help_text="Daňové identifikačné číslo"
    )

    # Kontaktné údaje
    address = models.TextField(
        verbose_name="Adresa",
        help_text="Úplná adresa organizácie"
    )

    email = models.EmailField(
        null=True,
        blank=True,
        verbose_name="Email",
        help_text="Hlavný email organizácie"
    )

    phone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="Telefón",
        help_text="Hlavné telefónne číslo"
    )

    # Systémové polia
    is_active = models.BooleanField(
        default=True,
        verbose_name="Aktívna",
        help_text="Označuje či je organizácia aktívna v systéme"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Vytvorené"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Aktualizované"
    )

    class Meta:
        verbose_name = "Organizácia"
        verbose_name_plural = "Organizácie"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_organization_type_display()})"

    @property
    def is_client(self):
        """Vráti True ak je organizácia klient."""
        return self.organization_type == 'client'

    @property
    def is_partner(self):
        """Vráti True ak je organizácia partner."""
        return self.organization_type == 'partner'

    def get_active_users_count(self):
        """Vráti počet aktívnych používateľov v organizácii."""
        return self.users.filter(is_active=True).count()

    def get_vehicles_count(self):
        """
        Vráti počet vozidiel organizácie.
        TODO: MOCK DATA - implementovať keď bude Vehicle model
        """
        # return self.vehicles.filter(is_active=True).count()
        return 0

    def get_trips_count(self):
        """
        Vráti počet jázd organizácie.
        TODO: MOCK DATA - implementovať keď bude Trip model
        """
        # return Trip.objects.filter(organization=self).count()
        return 0
