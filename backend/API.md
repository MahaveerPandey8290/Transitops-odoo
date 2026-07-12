# TransitOps — Backend API Contract

Hey team! The backend is up, running, and fully seed-populated. Use this document as the single source of truth for mock data, route names, request payloads, and response structures.

*   **Base URL:** `http://localhost:3000` (or local dev configuration)
*   **Headers:** For all authenticated endpoints, include `Authorization: Bearer <your-jwt-token>`
*   **Response Envelope:** All responses follow the `{ success: boolean, message?: string, data?: any }` format.
*   **Pagination Envelope:** List endpoints return `{ success: true, message: "OK", data: [...], meta: { total: number, page: number, limit: number, totalPages: number } }`

---

##  Demo Login Accounts

Use these pre-configured roles to test the different dashboard screens and permissions:

| Role | Email | Password | Allowed Mutating Actions |
|---|---|---|---|
| **Fleet Manager** | `fleet@transitsops.dev` | `Fleet@2026!` | Full Admin (vehicles, drivers, users, roles, maintenance, trips, expenses) |
| **Dispatcher** | `dispatch@transitsops.dev` | `Dispatch@2026!` | CRUD Drivers/Trips, Dispatch/Complete/Cancel Trips |
| **Safety Officer** | `safety@transitsops.dev` | `Safety@2026!` | CRUD Drivers/Vehicles, Open/Close Maintenance Logs |
| **Financial Analyst** | `finance@transitsops.dev` | `Finance@2026!` | Read-only dashboards/reports, Log Fuel & Expenses |

---

##  Available Endpoints

### 1. Authentication (`/api/auth`)

#### `POST /api/auth/register`
Creates a user with the default role of `DISPATCHER`.
*   **Payload:** `{ "email": "user@example.com", "password": "securepassword123", "name": "John Doe" }`
*   **Response (201):**
    ```json
    {
      "success": true,
      "message": "Registration successful",
      "data": {
        "token": "eyJhbGciOi...",
        "user": {
          "id": "cux123...",
          "email": "user@example.com",
          "name": "John Doe",
          "role": "DISPATCHER"
        }
      }
    }
    ```

#### `POST /api/auth/login`
Logs in the user. Note: **5 failed attempts locks the account for 15 minutes** (rate-limited route).
*   **Payload:** `{ "email": "fleet@transitsops.dev", "password": "Fleet@2026!" }`
*   **Response (200):** `{ "success": true, "message": "Login successful", "data": { "token": "...", "user": { ... } } }`
*   **Error Response (423 Locked):**
    ```json
    {
      "success": false,
      "message": "Account locked due to too many failed attempts. Try again in 15 minute(s).",
      "code": "ACCOUNT_LOCKED"
    }
    ```

#### `GET /api/auth/me`
*   **Headers:** `Authorization: Bearer <token>`
*   **Response (200):** `{ "success": true, "message": "OK", "data": { "id": "...", "email": "...", "name": "...", "role": "..." } }`

---

### 2. Vehicles (`/api/vehicles`)

#### `GET /api/vehicles`
*   **Query Params:** `?status=AVAILABLE|ON_TRIP|IN_SHOP|RETIRED&type=TRUCK|VAN|BUS|SEDAN|MOTORCYCLE&region=North&page=1&limit=20`
*   **Response (200):** Returns paginated vehicles list.

#### `GET /api/vehicles/available`
*   **Note:** Excludes `RETIRED` and `IN_SHOP` vehicles at the database level. Use this in the Trip Dispatch form dropdown.
*   **Response (200):**
    ```json
    {
      "success": true,
      "message": "OK",
      "data": [
        {
          "id": "cmrhc8akc0004ttfyj2zmc44r",
          "registrationNumber": "TRN-001",
          "make": "Tata",
          "model": "Ace Gold",
          "year": 2022,
          "type": "TRUCK",
          "status": "AVAILABLE",
          "region": "North",
          "maxLoadCapacityKg": "5000",
          "currentOdometerKm": "12400"
        }
      ]
    }
    ```

#### `POST /api/vehicles` (Fleet Manager only)
*   **Payload:**
    ```json
    {
      "registrationNumber": "TRN-999",
      "make": "Volvo",
      "model": "FMX",
      "year": 2023,
      "type": "TRUCK",
      "region": "North",
      "maxLoadCapacityKg": 15000,
      "currentOdometerKm": 120,
      "purchaseCost": 4500000
    }
    ```
*   **Response (201):** `{ "success": true, "message": "Vehicle created", "data": { ... } }`

#### `GET /api/vehicles/:id`
*   **Response (200):** `{ "success": true, "data": { ..., "_count": { "trips": 1, "maintenanceLogs": 0, "fuelLogs": 1 } } }`

#### `PATCH /api/vehicles/:id` (Fleet Manager only)
*   **Payload:** Partial vehicle fields to update.

---

### 3. Drivers (`/api/drivers`)

#### `GET /api/drivers`
*   **Query Params:** `?status=AVAILABLE|ON_TRIP|OFF_DUTY|SUSPENDED&region=North&page=1&limit=20`
*   **Response (200):** Returns paginated driver list. **Includes a computed `tripCompletionRate` (percentage of completed trips vs assigned trips) inside each driver object.**

#### `GET /api/drivers/available`
*   **Note:** Excludes drivers that are `SUSPENDED` or whose `licenseExpiryDate` is in the past. Use this in the Trip Dispatch form dropdown.
*   **Response (200):**
    ```json
    {
      "success": true,
      "message": "OK",
      "data": [
        {
          "id": "cmrhc8am2...",
          "name": "Ravi Kumar",
          "licenseNumber": "DL-2201-00001",
          "licenseCategory": "HMV",
          "licenseExpiryDate": "2028-06-30T00:00:00.000Z",
          "phone": "+91-9876540001",
          "safetyScore": 94,
          "status": "AVAILABLE",
          "region": "North"
        }
      ]
    }
    ```

#### `POST /api/drivers` (Fleet Manager / Dispatcher)
*   **Payload:**
    ```json
    {
      "name": "Suresh Raina",
      "licenseNumber": "DL-2201-00999",
      "licenseCategory": "HMV",
      "licenseExpiryDate": "2029-10-31T00:00:00.000Z",
      "phone": "+91-9876540999",
      "region": "South"
    }
    ```

#### `PATCH /api/drivers/:id` (Fleet Manager / Dispatcher)
*   **Payload:** Partial driver fields.

---

### 4. Trips (`/api/trips`)

#### `GET /api/trips`
*   **Query Params:** `?status=DRAFT|DISPATCHED|COMPLETED|CANCELLED&vehicleId=...&driverId=...&page=1&limit=20`

#### `POST /api/trips` (Fleet Manager / Dispatcher)
Creates a trip in the `DRAFT` state. **Validates cargo weight against the vehicle's capacity immediately.**
*   **Payload:**
    ```json
    {
      "vehicleId": "cmrhc...",
      "driverId": "cmrhc...",
      "origin": "Mumbai Warehouse",
      "destination": "Pune Hub",
      "cargoWeightKg": 1200,
      "plannedDistanceKm": 148,
      "revenue": 22000,
      "scheduledAt": "2026-07-13T10:00:00.000Z",
      "notes": "Fragile goods"
    }
    ```
*   **Error Response (422 Unprocessable):** If cargo exceeds max load:
    ```json
    {
      "success": false,
      "message": "Cargo 1200.00kg exceeds vehicle capacity 750.00kg",
      "code": "CARGO_EXCEEDS_CAPACITY"
    }
    ```

#### `POST /api/trips/:id/dispatch` (Fleet Manager / Dispatcher)
Atomically sets:
*   `Trip.status = DISPATCHED`
*   `Vehicle.status = ON_TRIP`
*   `Driver.status = ON_TRIP`
*   `Trip.startOdometerKm` takes a snapshot of the vehicle's current odometer.

*   **Error Response (409 Conflict):** If the vehicle/driver are already busy or the driver's license is expired/suspended:
    ```json
    {
      "success": false,
      "message": "Vehicle TRN-003 is not available (current status: ON_TRIP)",
      "code": "VEHICLE_NOT_AVAILABLE"
    }
    ```

#### `POST /api/trips/:id/complete` (Fleet Manager / Dispatcher)
Finishes the trip. Atomically:
*   Flips `Trip.status = COMPLETED`
*   Restores vehicle and driver status back to `AVAILABLE`
*   Creates a `FuelLog` under the hood to store final fuel costs (used for Reports)
*   Updates the `Vehicle.currentOdometerKm` to the new `finalOdometerKm`
*   **Payload:**
    ```json
    {
      "finalOdometerKm": 12700,
      "fuelLiters": 35.5,
      "pricePerLiter": 96.50
    }
    ```

#### `POST /api/trips/:id/cancel` (Fleet Manager / Dispatcher)
Cancels the trip.
*   If the trip was in `DRAFT`, it just sets status to `CANCELLED`.
*   If the trip was `DISPATCHED`, it also restores the vehicle and driver status back to `AVAILABLE`.

---

### 5. Maintenance (`/api/maintenance`)

#### `POST /api/maintenance` (Fleet Manager / Safety Officer)
Creates a maintenance log and immediately sets the vehicle's status to `IN_SHOP` in one transaction.
*   **Payload:**
    ```json
    {
      "vehicleId": "cmrhc...",
      "description": "Engine service and radiator flush",
      "cost": 8500
    }
    ```

#### `PATCH /api/maintenance/:id/close` (Fleet Manager / Safety Officer)
Closes the maintenance log.
*   Sets status to `CLOSED` and records `closedAt` timestamp.
*   Restores the vehicle's status to `AVAILABLE` **unless** the vehicle is currently `RETIRED`.

---

### 6. Fuel & Expenses (`/api/fuel-logs` and `/api/expenses`)

#### `POST /api/fuel-logs` (Fleet Manager / Dispatcher / Financial Analyst)
Logs a standalone refuel event (not tied to trip completion).
*   **Payload:**
    ```json
    {
      "vehicleId": "cmrhc...",
      "liters": 40,
      "pricePerLiter": 98.2,
      "odometer": 12850
    }
    ```

#### `POST /api/expenses` (Fleet Manager / Financial Analyst)
Logs miscellaneous expenses.
*   **Payload:**
    ```json
    {
      "vehicleId": "cmrhc...", // Optional
      "driverId": "cmrhc...",  // Optional
      "category": "TOLL",      // TOLL | PARKING | FINE | REPAIR | OTHER
      "amount": 350,
      "description": "Highway toll charges",
      "occurredAt": "2026-07-12T11:00:00.000Z"
    }
    ```

---

### 7. Dashboard & Reports (`/api/dashboard` and `/api/reports`)

#### `GET /api/dashboard/kpis`
Returns live aggregate counts for KPIs.
*   **Response (200):**
    ```json
    {
      "success": true,
      "data": {
        "vehicles": {
          "active": 4, // AVAILABLE + ON_TRIP + IN_SHOP
          "available": 2,
          "onTrip": 1,
          "inMaintenance": 1,
          "retired": 1
        },
        "trips": {
          "active": 1, // DISPATCHED
          "pending": 0, // DRAFT
          "completed": 1,
          "cancelled": 0
        },
        "drivers": {
          "onDuty": 4, // AVAILABLE + ON_TRIP
          "onTrip": 1,
          "available": 3,
          "offDuty": 0,
          "suspended": 1
        },
        "fleetUtilizationPct": 33 // ON_TRIP / (AVAILABLE + ON_TRIP)
      }
    }
    ```

#### `GET /api/reports/fuel-efficiency`
Returns a list of vehicles with km-per-liter calculations based on completed trips and fuel logs.

#### `GET /api/reports/fleet-utilization`
Returns total completed trips and percentage utilization per vehicle.

#### `GET /api/reports/operational-cost`
*   Returns aggregated fuel cost and maintenance cost per vehicle.
*   **Note:** Operational Cost = Fuel + Maintenance. Miscellaneous expenses (such as toll/fines) are shown as a separate column (`expenseCost`).

#### `GET /api/reports/vehicle-roi`
Returns the ROI percentage for each vehicle:
`ROI = (Total Fare Revenue - (Fuel Cost + Maintenance Cost)) / Vehicle Acquisition Cost * 100`

#### `GET /api/reports/export.csv`
Returns the operational cost report formatted as a CSV file attachment.

---

### 8. User Settings & Roles (`/api/users`)

#### `GET /api/users` (Fleet Manager only)
*   **Query Params:** `?page=1&limit=20`
*   **Response (200):** Returns safe details of registered users (excludes passwords and failed login attempt data).

#### `PATCH /api/users/:id/role` (Fleet Manager only)
Changes a user's role. **Fleet managers are restricted from changing their own role to prevent lockout.**
*   **Payload:** `{ "role": "SAFETY_OFFICER" }`
