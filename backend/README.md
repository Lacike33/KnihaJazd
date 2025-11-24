# Backend - Kniha jázd

Django REST Framework backend pre Kniha jázd aplikáciu.

## Technológie

- Django 5.2.8
- Django REST Framework
- SQLite (development)
- PostgreSQL (production - plánované)

## Vývoj

```bash
python manage.py runserver     # Spustenie dev servera
python manage.py migrate      # Migrácie databázy
python manage.py test         # Spustenie testov
```

## Modely

Budú vytvorené custom Django aplikácie pre:
- Jazdy
- Vozidlá  
- Vodiči
- Partneri
- Licencovanie