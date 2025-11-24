# CLAUDE.md

Tento súbor poskytuje návod pre Claude Code (claude.ai/code) pri práci s kódom v tomto repozitári.

## Prehľad projektu

**Kniha jázd** je komplexná aplikácia pre evidenciu jázd určená pre slovenských SZČO, malé firmy a flotily. Projekt zahŕňa webový frontend (Next.js), Django REST Framework backend, mobilnú aplikáciu, AI moduly, GPS integráciu, licencovací systém a partnerské programy.

## Architektúra

### Monorepo štruktúra
- Hlavný adresár: `/` (root)
- Backend: `/backend/` (Django REST Framework)
- Frontend: `/frontend/` (Next.js)

### Backend (Django)
- Umiestnený v adresári `/backend/`
- Štandardná štruktúra Django 5.2.8 projektu
- Používa SQLite databázu (development)
- Hlavná Django aplikácia v `backend/backend/`
- Templates adresár v `backend/templates/`

### Frontend (Next.js)
- Umiestnený v adresári `/frontend/`
- Next.js aplikácia pre webový frontend
- Komunikuje s Django REST API
- Moderný React s TypeScript

### Stav projektu
Toto je novo inicializovaný Django projekt. Codebase momentálne obsahuje iba základné Django scaffolding:
- Štandardný `manage.py` pre Django príkazy
- Základná konfigurácia nastavení s SQLite
- Prázdne URL patterny (iba admin route)
- Žiadne custom Django aplikácie ešte nie sú implementované

## Vývojové príkazy

### Django Backend
```bash
cd backend
python manage.py runserver          # Spustenie dev servera
python manage.py migrate           # Spustenie databázových migrácií
python manage.py makemigrations    # Vytvorenie nových migrácií
python manage.py createsuperuser   # Vytvorenie admin používateľa
python manage.py collectstatic     # Zhromaždenie statických súborov
python manage.py test             # Spustenie testov
```

### Next.js Frontend
```bash
cd frontend
npm install                        # Inštalácia závislostí
npm run dev                       # Spustenie dev servera
npm run build                     # Build produkčnej verzie
npm run start                     # Spustenie produkčnej verzie
npm run lint                      # Linting kódu
npm run type-check               # TypeScript type checking
```

## Plánovaná architektúra (z README)

### Základné modely (na implementáciu)
- **Jazdy** - Záznamy ciest s GPS dátami, účelom, vzdialenosťou
- **Vozidlá** - Technické údaje, spotreba paliva, doklady o poistení
- **Vodiči** - Predvolené vozidlá, prístupové oprávnenia
- **Partneri/Klienti** - Obchodné entity s predvolenými účelmi jázd
- **Šablóny** - Opakujúce sa vzory jázd
- **GPS jednotky** - Hardvérová integrácia a logy
- **Licencovanie** - Predplatné úrovne a limity používania

### Kľúčové funkcie (na implementáciu)
- JWT/OAuth autentifikácia
- REST API pre frontend a mobil
- OCR spracovanie dokumentov
- AI generovanie jázd
- Import GPS dát (NMEA formát)
- Automatizácia test suites s GitHub/GitLab webhooks
- Billing a subscription management

### Predplatné úrovne
- **Starter**: 10 jázd, 2 klienti, 1 šablóna
- **PRO**: 1 vozidlo s plnou funkcionalitou
- **Business**: 2-5 vozidiel

## AI Moduly (plánované)
1. **AI Tutor** - Interaktívny sprievodca onboardingom
2. **Trip Generator** - Automatické vytváranie jázd na základe vzorov
3. **Test Suites** - Automatické generovanie testov z commitov

## Poznámky k vývoju

- Projekt používa slovenský jazyk pre business logiku a dokumentáciu
- Musí vyhovieť slovenským zákonným požiadavkám DPH pre evidenciu jázd
- GPS integrácia podporuje eSIM aj offline USB export
- Mobilná aplikácia bude používať React Native/Expo s SQLite offline úložiskom
- Plánovaný je partnerský/affiliate systém pre predajcov automobilov