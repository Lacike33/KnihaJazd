# API Endpointy - Kniha jázd

Dokumentácia pre prechod z MOCK dát na reálne API volania.

## 📋 Prehľad implementácie

| Endpoint | Frontend Status | Backend Status | Mock pripravené | Popis |
|----------|----------------|----------------|-----------------|--------|
| `GET /v1/dashboard/stats` | ✅ Hotovo | ⏳ Čaká | ✅ Áno | Štatistiky pre dashboard |
| `GET /v1/drivers` | ✅ Hotovo | ⏳ Čaká | ✅ Áno | Zoznam vodičov s pagináciou |
| `POST /v1/drivers` | ⏳ Čaká | ⏳ Čaká | ❌ Nie | Vytvorenie nového vodiča |
| `PUT /v1/drivers/{id}` | ⏳ Čaká | ⏳ Čaká | ❌ Nie | Aktualizácia vodiča |
| `DELETE /v1/drivers/{id}` | ⏳ Čaká | ⏳ Čaká | ❌ Nie | Zmazanie vodiča |
| `GET /v1/vehicles` | ✅ Hotovo | ⏳ Čaká | ✅ Áno | Zoznam vozidiel s pagináciou |
| `POST /v1/vehicles` | ⏳ Čaká | ⏳ Čaká | ❌ Nie | Vytvorenie nového vozidla |
| `PUT /v1/vehicles/{id}` | ⏳ Čaká | ⏳ Čaká | ❌ Nie | Aktualizácia vozidla |
| `DELETE /v1/vehicles/{id}` | ⏳ Čaká | ⏳ Čaká | ❌ Nie | Zmazanie vozidla |
| `GET /v1/trips` | ✅ Hotovo | ⏳ Čaká | ✅ Áno | Zoznam jázd s pagináciou |
| `POST /v1/trips` | ⏳ Čaká | ⏳ Čaká | ❌ Nie | Vytvorenie novej jazdy |
| `PUT /v1/trips/{id}` | ⏳ Čaká | ⏳ Čaká | ❌ Nie | Aktualizácia jazdy |
| `DELETE /v1/trips/{id}` | ⏳ Čaká | ⏳ Čaká | ❌ Nie | Zmazanie jazdy |

**Legenda:**
- ✅ Hotovo - Implementované a testované
- ⏳ Čaká - Zaplánovane na implementáciu  
- ❌ Nie - Ešte nepripravené mock dáta

---

## 📊 Dashboard Štatistiky

**Endpoint:** `GET /v1/dashboard/stats`

**Popis:** Základné štatistiky pre dashboard - počet vozidiel, jázd a celkové kilometre.

### Odpoveď
```json
{
  "data": {
    "totalVehicles": 3,
    "totalTrips": 6,
    "totalKm": 1234.5,
    "businessKm": 678.9
  }
}
```

### Použitie na FE
Frontend má pripravené mock dáta a stačí zmeniť URL z mock na reálne API volanie.

---

## 👨‍💼 Vodiči (Drivers)

**Endpoint:** `GET /v1/drivers?page=1&pageSize=9`

**Popis:** Zoznam vodičov s podporou paginácie.

### Query parametre
- `page` - Číslo stránky (predvolené: 1)
- `pageSize` - Počet záznamov na stránku (predvolené: 10)

### Odpoveď
```json
{
  "data": [
    {
      "id": "1",
      "name": "Peter Novák",
      "userId": "2",
      "role": "driver",
      "defaultVehicleId": "1",
      "drivingPermission": "only_default"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 9,
    "total": 25,
    "totalPages": 3
  }
}
```

### Použitie na FE
Frontend má pripravené mock dáta a stačí zmeniť URL z mock na reálne API volanie.

---

## 🚗 Vozidlá (Vehicles)

**Endpoint:** `GET /v1/vehicles?page=1&pageSize=9`

**Popis:** Zoznam vozidiel s kompletnou špecifikáciou, sporebou paliva a poistením.

### Query parametre
- `page` - Číslo stránky (predvolené: 1)
- `pageSize` - Počet záznamov na stránku (predvolené: 10)
- `active` - Filter aktívnych vozidiel (optional)

### Odpoveď
```json
{
  "data": [
    {
      "id": "1",
      "registrationNo": "BA123CD",
      "brand": "Škoda",
      "model": "Octavia",
      "year": 2020,
      "vin": "TMBJJ7NE9L0123456",
      "odoInitialKm": 45000,
      "ownershipType": "company",
      "registrationDate": "2020-03-15",
      "vatRegime": "100_business",
      "autoImportEnabled": true,
      "templateUsageEnabled": true,
      "kmMatchingTolerance": 5,
      "active": true,
      "imageUrl": "/skoda-octavia-silver-2020.jpg",
      "fuelConsumption": {
        "fuelType": "diesel",
        "averageConsumption": 5.8,
        "cityConsumption": 6.5,
        "highwayConsumption": 5.2,
        "combinedConsumption": 5.8
      },
      "insurance": {
        "id": "ins-1",
        "vehicleId": "1",
        "type": "comprehensive",
        "policyNumber": "POL-2024-001234",
        "insuranceCompany": "Allianz",
        "validFrom": "2024-01-01",
        "validTo": "2024-12-31",
        "reminderDays": 30,
        "cost": 850,
        "notes": "Poistenie zahŕňa havarijné aj PZP"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 9,
    "total": 15,
    "totalPages": 2
  }
}
```

### Použitie na FE
Frontend má pripravené mock dáta a stačí zmeniť URL z mock na reálne API volanie.

---

## 🛣️ Jazdy (Trips)

**Endpoint:** `GET /v1/trips?page=1&pageSize=9`

**Popis:** Zoznam jázd s kompletnou špecifikáciou vrátane vodičov a vozidiel.

### Query parametre
- `page` - Číslo stránky (predvolené: 1)
- `pageSize` - Počet záznamov na stránku (predvolené: 10)
- `vehicleId` - Filter podľa vozidla (optional)
- `driverId` - Filter podľa vodiča (optional)
- `type` - Filter podľa typu jazdy: `business|private` (optional)
- `dateFrom` - Filter od dátumu (optional)
- `dateTo` - Filter do dátumu (optional)

### Odpoveď
```json
{
  "data": [
    {
      "id": "1",
      "vehicleId": "1",
      "driverId": "1",
      "startLocation": "Bratislava, Hlavná 1",
      "endLocation": "Košice, Námestie 5",
      "distanceKm": 395,
      "startTime": "2024-01-15T08:00:00Z",
      "endTime": "2024-01-15T12:30:00Z",
      "startOdometer": 45000,
      "endOdometer": 45395,
      "odometerPhotoUrl": "/car-odometer-45395km.jpg",
      "odometerPhotoTakenBy": "Peter Novák",
      "odometerPhotoTakenAt": "2024-01-15T12:30:00Z",
      "ocrOriginalValue": 45398,
      "ocrCorrectedValue": 45395,
      "templateName": "Šablóna: Služobná cesta",
      "type": "business",
      "description": "Stretnutie s klientom",
      "source": "gps_auto",
      "locked": true,
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-01-15T12:30:00Z",
      "driver": {
        "id": "1",
        "name": "Peter Novák",
        "userId": "2",
        "role": "driver",
        "defaultVehicleId": "1",
        "drivingPermission": "only_default"
      },
      "vehicle": {
        "id": "1",
        "registrationNo": "BA123CD",
        "brand": "Škoda",
        "model": "Octavia",
        "year": 2020,
        "vin": "TMBJJ7NE9L0123456",
        "odoInitialKm": 45000,
        "ownershipType": "company",
        "registrationDate": "2020-03-15",
        "vatRegime": "100_business",
        "autoImportEnabled": true,
        "templateUsageEnabled": true,
        "kmMatchingTolerance": 5,
        "active": true,
        "imageUrl": "/skoda-octavia-silver-2020.jpg",
        "fuelConsumption": {
          "fuelType": "diesel",
          "averageConsumption": 5.8,
          "cityConsumption": 6.5,
          "highwayConsumption": 5.2,
          "combinedConsumption": 5.8
        },
        "insurance": {
          "id": "ins-1",
          "vehicleId": "1",
          "type": "comprehensive",
          "policyNumber": "POL-2024-001234",
          "insuranceCompany": "Allianz",
          "validFrom": "2024-01-01",
          "validTo": "2024-12-31",
          "reminderDays": 30,
          "cost": 850,
          "notes": "Poistenie zahŕňa havarijné aj PZP"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 9,
    "total": 156,
    "totalPages": 18
  }
}
```

### Použitie na FE
Frontend má pripravené mock dáta a stačí zmeniť URL z mock na reálne API volanie.

**Poznámka:** Driver a vehicle objekty sú vložené (embedded) v response, takže FE nemusí robiť dodatočné API volania.
