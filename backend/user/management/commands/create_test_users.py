"""
Django management command pre vytvorenie testovacích používateľov.

Vytvorí 3 testovacích používateľov s rôznymi rolami v jednej organizácii typu client.
"""

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from organization.models import Organization

User = get_user_model()


class Command(BaseCommand):
    help = 'Vytvorí testovacích používateľov pre development'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--organization-name',
            type=str,
            default='Kniha jázd s.r.o.',
            help='Názov organizácie (default: Kniha jázd s.r.o.)'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Prepíše existujúcich používateľov ak existujú'
        )
    
    def handle(self, *args, **options):
        organization_name = options['organization_name']
        force = options['force']
        
        # Definícia testovacích používateľov
        test_users = [
            {
                'email': 'admin@knihajazd.sk',
                'username': 'admin',
                'password': 'admin123',
                'first_name': 'Administrátor',
                'last_name': 'Systému',
                'groups': ['Administrátori'],
                'is_organization_admin': True,
                'position': 'Správca systému'
            },
            {
                'email': 'vodic@knihajazd.sk', 
                'username': 'vodic',
                'password': 'vodic123',
                'first_name': 'Ján',
                'last_name': 'Vodič',
                'groups': ['Vodiči'],
                'is_organization_admin': False,
                'position': 'Profesionálny vodič',
                'phone': '+421901234567'
            },
            {
                'email': 'uctovnik@knihajazd.sk',
                'username': 'uctovnik', 
                'password': 'uctovnik123',
                'first_name': 'Mária',
                'last_name': 'Účtovníčka',
                'groups': ['Účtovníci'],
                'is_organization_admin': False,
                'position': 'Hlavná účtovníčka',
                'phone': '+421907654321'
            }
        ]
        
        try:
            with transaction.atomic():
                # Skontroluj či používatelia už existujú
                existing_emails = [user['email'] for user in test_users]
                existing_users = User.objects.filter(email__in=existing_emails)
                
                if existing_users.exists() and not force:
                    existing_list = ', '.join([user.email for user in existing_users])
                    raise CommandError(
                        f"Používatelia už existujú: {existing_list}. "
                        f"Použite --force pre prepísanie."
                    )
                
                # Zmaž existujúcich používateľov ak je force
                if existing_users.exists() and force:
                    existing_list = ', '.join([user.email for user in existing_users])
                    self.stdout.write(
                        self.style.WARNING(f'Mažem existujúcich používateľov: {existing_list}')
                    )
                    existing_users.delete()
                
                # Vytvor alebo získaj organizáciu
                organization, org_created = Organization.objects.get_or_create(
                    name=organization_name,
                    defaults={
                        'organization_type': 'client',
                        'address': 'Bratislava, Slovenská republika',
                        'email': 'info@knihajazd.sk',
                        'phone': '+421911123456',
                        'ico': '12345678',
                        'dic': '1234567890'
                    }
                )
                
                if org_created:
                    self.stdout.write(
                        self.style.SUCCESS(f'Vytvorená organizácia: {organization.name}')
                    )
                else:
                    self.stdout.write(f'Použitá existujúca organizácia: {organization.name}')
                
                # Vytvor používateľov
                created_users = []
                for user_data in test_users.copy():  # Copy to preserve original data
                    password = user_data.pop('password')
                    groups = user_data.pop('groups', [])
                    
                    user = User.objects.create_user(
                        password=password,
                        **user_data
                    )
                    user.organization = organization
                    user.save()
                    
                    # Prideľ skupiny (role)
                    for group_name in groups:
                        try:
                            group = Group.objects.get(name=group_name)
                            user.groups.add(group)
                        except Group.DoesNotExist:
                            self.stdout.write(
                                self.style.WARNING(f'⚠️  Skupina "{group_name}" neexistuje!')
                            )
                    
                    created_users.append((user, password, groups))  # Store groups for output
                    
                    groups_str = ', '.join(groups) if groups else 'Žiadne skupiny'
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Vytvorený používateľ: {user.email} '
                            f'({groups_str}) '
                            f'- heslo: {password}'
                        )
                    )
                
                # Súhrn
                self.stdout.write(
                    self.style.SUCCESS(
                        f'\\n✅ Úspešne vytvorených {len(created_users)} používateľov '
                        f'v organizácii "{organization.name}"\\n'
                    )
                )
                
                self.stdout.write('📋 Prihlasovacie údaje:')
                for user, password, groups in created_users:
                    groups_str = ', '.join(groups) if groups else 'Základný používateľ'
                    self.stdout.write(
                        f"  {user.email} / {password} "
                        f"({groups_str})"
                    )
                
        except Exception as e:
            raise CommandError(f'Chyba pri vytváraní používateľov: {str(e)}')