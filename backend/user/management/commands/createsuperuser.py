"""
Custom createsuperuser command pre CustomUser model.

Rozširuje štandardný Django createsuperuser command o vytvorenie
organizácie pre superuser používateľa.
"""

from django.core.management.base import BaseCommand
from django.core.management import CommandError
from django.contrib.auth import get_user_model
from organization.models import Organization
import getpass
import sys

User = get_user_model()


class Command(BaseCommand):
    help = 'Vytvorí superuser s automatickou organizáciou'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.UserModel = User
        self.username_field = self.UserModel._meta.get_field(self.UserModel.USERNAME_FIELD)

    def add_arguments(self, parser):
        parser.add_argument(
            '--%s' % self.UserModel.USERNAME_FIELD,
            dest=self.UserModel.USERNAME_FIELD, 
            default=None,
            help='Specifies the login for the superuser.',
        )
        parser.add_argument(
            '--email',
            dest='email', 
            default=None,
            help='Specifies the email for the superuser.',
        )
        parser.add_argument(
            '--first_name',
            dest='first_name',
            default=None,
            help='Specifies the first name for the superuser.',
        )
        parser.add_argument(
            '--last_name',
            dest='last_name',
            default=None,
            help='Specifies the last name for the superuser.',
        )
        parser.add_argument(
            '--noinput', '--no-input',
            action='store_false',
            dest='interactive',
            default=True,
            help='Tells Django to NOT prompt the user for input of any kind.',
        )

    def handle(self, *args, **options):
        username = options[self.UserModel.USERNAME_FIELD]
        email = options['email']
        first_name = options['first_name'] 
        last_name = options['last_name']
        interactive = options['interactive']
        
        # Kontrola existujúceho superuser
        if self.UserModel.objects.filter(is_superuser=True).exists():
            self.stdout.write(
                self.style.WARNING('Superuser už existuje!')
            )
            
        if interactive:
            try:
                # Interaktívny input
                if not username:
                    username = input('Email (username): ')
                if not email:
                    email = username  # Email ako username
                if not first_name:
                    first_name = input('Krstné meno: ')
                if not last_name:
                    last_name = input('Priezvisko: ')
                    
                # Heslo
                password = None
                while password is None:
                    password = getpass.getpass('Heslo: ')
                    password2 = getpass.getpass('Heslo (znovu): ')
                    if password != password2:
                        self.stderr.write("Heslá sa nezhodujú. Skúste znovu.")
                        password = None
                        continue
                    if len(password.strip()) == 0:
                        self.stderr.write("Prázdne heslo nie je povolené.")
                        password = None
                        
            except KeyboardInterrupt:
                self.stderr.write("\nOperácia zrušená.")
                sys.exit(1)
        else:
            # Non-interactive mode
            if not username or not email:
                raise CommandError("V non-interactive mode musíte zadať username a email")
            password = "admin123"  # Default heslo pre non-interactive mode
                
        # Vytvorenie organizácie pre superuser
        if first_name and last_name:
            org_name = f"{first_name} {last_name} (Admin)"
        else:
            org_name = f"Admin organizácia ({username})"
            
        organization = Organization.objects.create(
            name=org_name,
            organization_type='client',
            email=email,
            address="Admin adresa",
            is_active=True
        )
        
        # Vytvorenie superuser
        user = self.UserModel.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name or "",
            last_name=last_name or "",
            is_superuser=True,
            is_staff=True,
            is_organization_admin=True,
            organization=organization  # Priradenie organizácie
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Superuser "{username}" bol úspešne vytvorený s organizáciou "{organization.name}"'
            )
        )