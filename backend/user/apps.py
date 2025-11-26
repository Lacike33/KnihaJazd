from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "user"
    verbose_name = "Používatelia"
    
    def ready(self):
        """
        Aplikácia je pripravená na použitie.
        
        V budúcnosti tu môžeme registrovať signals ak budú potrebné.
        """
        pass
