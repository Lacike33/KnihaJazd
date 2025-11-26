from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "user"
    verbose_name = "Používatelia"
    
    def ready(self):
        """
        Registrácia signals pri štarte aplikácie.
        
        Zabezpečuje že sa signals zaregistrujú keď sa aplikácia načíta
        a budú fungovať automatické vytváranie organizácií.
        """
        import user.signals  # noqa
