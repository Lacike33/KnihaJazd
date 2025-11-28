"""
Django management command pre vytvorenie Groups a pridelenie Permissions.

Vytvorí predefinované skupiny (role) a prideľí im príslušné oprávnenia
podľa business logiky aplikácie.
"""

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db import transaction

from user.models import CustomUser


class Command(BaseCommand):
    help = 'Vytvorí Groups (role) a prideľí im príslušné Permissions'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Prepíše existujúce skupiny a oprávnenia'
        )
        parser.add_argument(
            '--list-permissions',
            action='store_true',
            help='Zobrazí zoznam všetkých dostupných permissions'
        )
    
    def handle(self, *args, **options):
        if options['list_permissions']:
            self.list_all_permissions()
            return
            
        force = options['force']
        
        # Definícia Groups a ich Permissions
        groups_config = {
            'Administrátori': {
                'description': 'Plné oprávnenia pre správu organizácie',
                'permissions': [
                    # Organizácia
                    'user.manage_organization',
                    'user.view_organization_stats', 
                    'user.manage_organization_users',
                    
                    # Vozidlá
                    'user.manage_vehicles',
                    'user.drive_vehicles',
                    'user.view_vehicle_reports',
                    
                    # Jazdy
                    'user.create_trips',
                    'user.edit_own_trips',
                    'user.edit_all_trips',
                    'user.delete_trips',
                    'user.approve_trips',
                    
                    # Výkazy
                    'user.view_reports',
                    'user.generate_reports',
                    'user.export_reports',
                    
                    # Účtovníctvo
                    'user.manage_accounting',
                    'user.view_financial_data',
                    'user.manage_expenses',
                    
                    # Admin
                    'user.access_admin_panel',
                    'user.manage_system_settings',
                    
                    # Django built-in permissions
                    'user.add_customuser',
                    'user.change_customuser',
                    'user.delete_customuser',
                    'user.view_customuser',
                ]
            },
            
            'Vodiči': {
                'description': 'Oprávnenia pre vodičov vozidiel',
                'permissions': [
                    # Vozidlá
                    'user.drive_vehicles',
                    'user.view_vehicle_reports',
                    
                    # Jazdy 
                    'user.create_trips',
                    'user.edit_own_trips',
                    
                    # Výkazy (obmedzené)
                    'user.view_reports',
                    
                    # Django permissions (obmedzené)
                    'user.view_customuser',  # Môžu vidieť ostatných používateľov
                ]
            },
            
            'Účtovníci': {
                'description': 'Oprávnenia pre účtovníctvo a finančné výkazy',
                'permissions': [
                    # Organizácia (obmedzené)
                    'user.view_organization_stats',
                    
                    # Jazdy (read-only + schvaľovanie)
                    'user.approve_trips',
                    'user.edit_all_trips',  # Pre opravy účtovných dát
                    
                    # Výkazy
                    'user.view_reports',
                    'user.generate_reports', 
                    'user.export_reports',
                    
                    # Účtovníctvo
                    'user.manage_accounting',
                    'user.view_financial_data',
                    'user.manage_expenses',
                    
                    # Django permissions
                    'user.view_customuser',
                    'user.change_customuser',  # Pre úpravu account info
                ]
            },
            
            'Používatelia': {
                'description': 'Základné oprávnenia pre bežných používateľov',
                'permissions': [
                    # Jazdy (obmedzené)
                    'user.create_trips',
                    'user.edit_own_trips',
                    
                    # Výkazy (read-only)
                    'user.view_reports',
                    
                    # Django permissions (minimálne)
                    'user.view_customuser',
                ]
            }
        }
        
        try:
            with transaction.atomic():
                # Zmaž existujúce skupiny ak je force
                if force:
                    existing_groups = Group.objects.filter(name__in=groups_config.keys())
                    if existing_groups.exists():
                        group_names = ', '.join([g.name for g in existing_groups])
                        self.stdout.write(
                            self.style.WARNING(f'Mažem existujúce skupiny: {group_names}')
                        )
                        existing_groups.delete()
                
                created_groups = []
                
                # Vytvor skupiny a prideľ oprávnenia
                for group_name, config in groups_config.items():
                    # Vytvor skupinu
                    group, created = Group.objects.get_or_create(name=group_name)
                    
                    if not created and not force:
                        self.stdout.write(
                            self.style.WARNING(f'Skupina "{group_name}" už existuje, preskakujem...')
                        )
                        continue
                    
                    # Vyčisti existujúce oprávnenia ak je force
                    if force:
                        group.permissions.clear()
                    
                    # Prideľ oprávnenia
                    permissions_added = 0
                    for perm_codename in config['permissions']:
                        try:
                            # Parse permission (app_label.codename)
                            app_label, codename = perm_codename.split('.', 1)
                            permission = Permission.objects.get(
                                content_type__app_label=app_label,
                                codename=codename
                            )
                            group.permissions.add(permission)
                            permissions_added += 1
                            
                        except Permission.DoesNotExist:
                            self.stdout.write(
                                self.style.ERROR(
                                    f'⚠️  Permission "{perm_codename}" neexistuje!'
                                )
                            )
                        except ValueError:
                            self.stdout.write(
                                self.style.ERROR(
                                    f'⚠️  Nesprávny formát permission: "{perm_codename}"'
                                )
                            )
                    
                    created_groups.append((group, permissions_added))
                    
                    status = "vytvorená" if created else "aktualizovaná"
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'✅ Skupina "{group_name}" {status} '
                            f'({permissions_added} oprávnení)'
                        )
                    )
                    self.stdout.write(f'   📝 {config["description"]}')
                
                # Súhrn
                self.stdout.write(
                    self.style.SUCCESS(
                        f'\\n🎉 Úspešne spracovaných {len(created_groups)} skupín!\\n'
                    )
                )
                
                # Zobraz inštrukcie
                self.stdout.write('📋 Použitie:')
                self.stdout.write('  • V Django admin: /admin/auth/group/')
                self.stdout.write('  • Programovo: user.groups.add(Group.objects.get(name="Vodiči"))')
                self.stdout.write('  • Helper metódy: user.is_driver(), user.has_organization_permission("create_trips")')
                
        except Exception as e:
            raise CommandError(f'Chyba pri vytváraní skupín: {str(e)}')
    
    def list_all_permissions(self):
        """Zobrazí zoznam všetkých dostupných permissions."""
        self.stdout.write(self.style.SUCCESS('📋 Dostupné Permissions:\\n'))
        
        # User app permissions
        user_ct = ContentType.objects.get_for_model(CustomUser)
        user_permissions = Permission.objects.filter(content_type=user_ct)
        
        self.stdout.write(self.style.WARNING('User aplikácia:'))
        for perm in user_permissions:
            self.stdout.write(f'  user.{perm.codename} - {perm.name}')
        
        # Zobraziť permissions z iných aplikácií
        other_permissions = Permission.objects.exclude(content_type=user_ct).order_by('content_type__app_label', 'codename')
        
        current_app = None
        for perm in other_permissions:
            app_label = perm.content_type.app_label
            if app_label != current_app:
                self.stdout.write(f'\\n{app_label.title()} aplikácia:')
                current_app = app_label
            self.stdout.write(f'  {app_label}.{perm.codename} - {perm.name}')