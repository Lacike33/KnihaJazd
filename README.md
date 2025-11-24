# Kniha jázd – Kompletný README

Tento projekt predstavuje modernú online a mobilnú aplikáciu **Kniha jázd**, určenú pre SZČO, malé firmy, flotily a predajcov vozidiel. Projekt obsahuje **frontend (React)**, **backend (Django DRF)**, **mobilnú aplikáciu**, **AI moduly**, **GPS integráciu**, **licencovanie**, **platené balíčky**, **automatizácie**, **OCR**, **partner program**, a mnoho ďalšieho.

---

## 🔥 Hlavné ciele projektu

* Poskytnúť kompletné riešenie pre evidenciu jázd podľa zákona o DPH.
* Automatizovať čo najviac agendy (OCR, GPS, AI generovanie jázd, predvyplnenia).
* Zabezpečiť jednoduché UX (3 kliky k výsledku).
* Plná funkcionalita na webe aj v mobile.
* Podpora partnerov, predajcov a affiliate systému.
* Integrácia s lokálnymi aj cloudovými GPS modulmi.

---

## 🧩 Architektúra projektu

### Frontend (React, Vercel)

* Moderný React FE
* Komponenty pre:

  * Jazdy
  * Vozidlá
  * Vodiči
  * Partneri
  * Šablóny jázd
  * GPS modul
  * Test Suites (AI testovanie)
  * Licensing manager
* Dynamická sidebar navigácia
* Podpora AI tutoring modu (onboarding)
* OCR upload
* Dashboard + prehľady
* Autogenerovanie jázd UI

### Backend (Django DRF)

* Autentifikácia (JWT / OAuth)
* API pre FE + Mobil
* Modely pre:

  * Jazdy
  * Vozidlá (technické údaje, spotreba, poistka, dokumenty)
  * Vodiči (default vozidlo, práva na vozidlá)
  * Partneri
  * Sablóny jázd (pravidelné jazdy)
  * Licensing Manager
  * Billing/Product Packages
  * GPS jednotky + logy
  * OCR dokumenty
  * Auto-generovanie jázd
  * AI Test Suites modul
* Webhook handler pre GitHub/GitLab (test auto-generácia)
* Analyzer commitov/diffov
* Test Suites API
* DevOps integrácie (CI/CD, Webhooky)

---

## 📦 Platené balíčky

### **Starter**

* 10 jázd
* 2 klienti
* 1 šablóna

### **PRO**

* 1 vozidlo s kompletnou funkcionalitou

### **Business**

* 2 – 5 vozidiel

### Licensing manager

* Validácia tokenov + limitov
* Rate limiting podľa balíčka
* Expirácia
* Prepojenie s billing systémom

---

## 🚗 Funkcionalita aplikácie

### Evidencia jázd

* ručné pridanie
* OCR fotka bločku
* GPS import
* Samogenerovanie jázd
* Šablóny jázd
* Pravidelné jazdy

### Vozidlá

* Technické údaje (spotreba)
* Poistky
* Dokumenty
* Servisné intervaly

### Vodiči

* Defaultné vozidlo
* Prístupové práva

### Partneri / Klienti

* Evidencia subjektov
* Default účel jazdy
* Affiliate program s unikátnym linkom

---

## 🤖 AI Moduly

### 1. AI Tutor (onboarding)

* Interaktívny sprievodca aplikáciou
* Vysvetlenie funkcií ako herný tutorial
* Dynamické kroky podľa toho, kde je užívateľ

### 2. AI pre generovanie jázd

* Náhodné generovanie jázd pre vybraných partnerov
* Analýza času, partnerov, kilometrov
* Parametre: dátumové obdobie, tachometer, víkendy, voľné dni

### 3. AI Test Suites modul

Obsahuje:

* Source reference
* Overview
* Test editor
* Requirements link panel
* Výber typu testov: UI / API / Performance / Security
* Automatická generácia testov po pushoch
* GitHub/GitLab webhook integrácie
* Branch filtrácia a overrides
* Analyzer commitov
* Endpoint `generate-tests`
* Dry-run mód
* Logovanie a notifikácie
* Frontend UI pre test suites
* Backend API na správu

---

## 📡 GPS modul integrácia

### Požiadavky

* eSIM
* offline fallback cez USB export
* Posielanie RAW dát aj JSON

### Príklad RAW dát

```
$GPRMC,120310.00,A,4834.5678,N,01712.3456,E,0.023,,161024,,,A*6C
```

### Dekódovaný JSON

```json
{
  "lat": 48.57613,
  "lon": 17.20576,
  "speed_kmh": 1.2,
  "timestamp": "2024-10-16T12:03:10Z",
  "satellites": 12
}
```

---

## 📱 Mobilná aplikácia

### Obsahuje

* React Native / Expo
* Offline SQLite databáza
* Flow diagram komunikácie s backendom
* OCR upload
* GPS live import
* UX založené na 3 klikoch

### Mobilná DB (SQLite) – základné tabuľky

* vehicles
* drivers
* rides
* partners
* templates
* documents
* sync_queue

---

## 🧾 Výkazy podľa zákona o DPH

* Definícia jazdy podľa zákona
* Jazda = každá samostatná cesta bez ohľadu na účel
* Príklady započítania jázd
* Vzor tlačiva knihy jázd (PDF output generovaný v appke)
* Spracovanie tankovania + pauza 5/20 min

---

## 🌐 Landing Page – obsah

### Sekcie

* Hlavné benefity
* Funkcie
* Prečo Kniha jázd
* Pre SZČO / malé firmy / flotily
* GPS riešenie
* AI moduly
* Affiliate partneri
* Sekcia pre predajcov automobilov
* Marketingové materiály
* Pre Vercel AI generátor obsahu

---

## 🤝 Partneri / Predajcovia

### Predajca na svojej stránke má:

* Logo Kniha jázd
* Promo text
* Affiliate link
* Promo PDF

### Komunikácia pre predajcov

* Ako služba pomáha predávať vozidlá s odpočtom DPH
* Ako zarábajú provízie
* Jednoduché API pre registráciu klientov

---

## 🛠 DevOps

* Webhooky (GitHub/GitLab) pre AI Test Suite
* CI/CD buildy FE + BE
* Automatické deploye
* Monitoring
* Logging

---

## 📚 Technická dokumentácia

* UML diagramy
* ERD databázy
* API dokumentácia (OpenAPI/Swagger)
* Príklady requestov/response

---

## 📌 Roadmap

* ☐ Finalizácia licensing systému
* ☐ Integrácia GPS modulov
* ☐ Mobil UI onboarding
* ☐ AI tutor beta
* ☐ Vydanie Beta verzie

---

## 🏁 Záver

Tento README slúži ako úvodná “master dokumentácia” pre celý projekt Kniha jázd – web, backend, mobil, AI a partner systém. Obsahuje všetky známe komponenty, moduly, architektonické návrhy a logiku projektu.