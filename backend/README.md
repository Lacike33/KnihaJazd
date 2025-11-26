# Backend - Kniha jázd

Django REST Framework backend pre Kniha jázd aplikáciu.

## 🚀 Quick Start pre FE Developer

Rýchly setup na čerstvo klonovanom repozitári:

```bash
# 1. Prejdi do backend adresára
cd backend

# 2. Vytvor a aktivuj virtual environment (Python 3.8+)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# alebo na Windows: venv\Scripts\activate

# 3. Nainštaluj dependencies
pip install -r requirements.txt

# 4. Vytvor databázu a aplikuj migrácie
python manage.py migrate

# 5. Nasetupuj Groups a Permissions
python manage.py setup_groups_permissions

# 6. Vytvor testovacích používateľov
python manage.py create_test_users

# 7. Spusti development server
python manage.py runserver
```

### 🔑 Test Users (po setup)

| Email | Heslo | Skupina | Oprávnenia |
|-------|--------|---------|------------|
| `admin@knihajazd.sk` | `admin123` | Administrátori | Všetky |
| `vodic@knihajazd.sk` | `vodic123` | Vodiči | Jazdy, vozidlá |
| `uctovnik@knihajazd.sk` | `uctovnik123` | Účtovníci | Účtovníctvo, výkazy |

### 📡 API Endpoints

- **Base URL:** `http://127.0.0.1:8000/api/v1/`
- **Swagger UI:** `http://127.0.0.1:8000/docs/`
- **Admin panel:** `http://127.0.0.1:8000/admin/`

#### Auth Endpoints
```bash
POST /api/v1/users/auth/login/     # Prihlásenie (JWT)
POST /api/v1/users/auth/refresh/   # Refresh token  
POST /api/v1/users/auth/verify/    # Validácia tokenu (200/401)
POST /api/v1/users/auth/register/  # Registrácia
GET  /api/v1/users/me/             # Aktuálny používateľ
```

#### User Management
```bash
GET  /api/v1/users/                # Zoznam používateľov v organizácii
GET  /api/v1/users/{id}/           # Detail používateľa
GET  /api/v1/users/me/stats/       # Štatistiky používateľa
```

### 🔧 Užitočné commands

```bash
# Reštart s čistou databázou
python manage.py flush
python manage.py migrate
python manage.py setup_groups_permissions
python manage.py create_test_users

# Vytvor superuser pre admin panel
python manage.py createsuperuser

# Spusti testy
python manage.py test

# Pozri migrácie
python manage.py showmigrations
```

## Technológie

- Django 5.2.8
- Django REST Framework
- djangorestframework-simplejwt (JWT auth)
- drf-spectacular (OpenAPI/Swagger docs)
- SQLite (development)
- PostgreSQL (production - plánované)

## Architektúra

### Apps
- `user/` - Používatelia, Groups & Permissions
- `organization/` - Organizácie a firmy
- `api/` - API routing a versioning

### Autentifikácia
- JWT tokens cez djangorestframework-simplejwt
- Django Groups & Permissions pre role-based access
- Custom user model s organization support

### Groups (Role)
- **Administrátori** - Plné oprávnenia
- **Vodiči** - Jazdy a vozidlá
- **Účtovníci** - Financie a výkazy  
- **Používatelia** - Základné oprávnenia

## Plánované modely

Budú vytvorené Django aplikácie pre:
- Jazdy (trips)
- Vozidlá (vehicles)
- GPS tracking
- Účtovníctvo (accounting)
- Licencovanie (licensing)