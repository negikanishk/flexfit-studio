# FlexFit Studio — Business Domain Map

This document explains each of the 9 core business domains in FlexFit Studio, what each domain owns, its key business rules, code location, and cross-domain dependencies.

---

## 1. Members Domain (`src/features/members`)
- **Owns**: Member identity, contact profiles, user roles (`admin`, `front_desk`, `trainer`, `member`), personal credit balance tracking, and status (`active`, `inactive`, `suspended`).
- **Main Business Rules**:
  - Members must have unique email addresses.
  - Personal credits cannot drop below 0.
- **Code Location**: `src/features/members/`
- **Dependencies**: Memberships, Companies.

---

## 2. Memberships Domain (`src/features/memberships`)
- **Owns**: Membership tiers (`Basic`, `Pro`, `VIP Unlimited`), monthly pricing, and recurring credit allocations.
- **Main Business Rules**:
  - Tiers define default credit allocations added to member accounts monthly.
- **Code Location**: `src/features/memberships/`
- **Dependencies**: Database Schema.

---

## 3. Credits Domain (`src/features/credits`)
- **Owns**: Authoritative calculation of available credits (personal + corporate pool), credit deduction order, and financial audit ledger logging.
- **Main Business Rules**:
  - When booking classes, system checks Personal Credits first. If insufficient, it checks Corporate Credit Pool.
  - All credit movements record an audit transaction in `transactions`.
- **Code Location**: `src/features/credits/`
- **Dependencies**: Members, Companies, Database Schema.

---

## 4. Bookings Domain (`src/features/bookings`)
- **Owns**: Class creation, class capacity limits, reservation bookings, cancellations, and check-in status tracking.
- **Main Business Rules**:
  - Cannot book a class if capacity is full (routes user to Waitlists).
  - Cannot book duplicate active reservations for the same session.
  - Cancelling a booking refunds credits and triggers automatic waitlist promotion.
- **Code Location**: `src/features/bookings/`
- **Dependencies**: Credits, Waitlists, Members, Trainers.

---

## 5. Waitlists Domain (`src/features/waitlists`)
- **Owns**: Waitlist queue positioning, joining waitlists when classes fill up, and queue candidate promotion.
- **Main Business Rules**:
  - Queue position is strictly sequential (`1, 2, 3...`).
  - When a booking is cancelled, candidate #1 is automatically promoted, credits are deducted, and a confirmed booking is created.
- **Code Location**: `src/features/waitlists/`
- **Dependencies**: Members, Bookings.

---

## 6. Front Desk Operations Domain (`src/features/front-desk`)
- **Owns**: Daily schedule view, one-click attendee check-in processing, and member lookup.
- **Main Business Rules**:
  - Front Desk staff can quickly check in members upon arrival.
- **Code Location**: `src/features/front-desk/`
- **Dependencies**: Bookings, Members.

---

## 7. Trainers Domain (`src/features/trainers`)
- **Owns**: Trainer instructor profiles, certified specialties (HIIT, Yoga, Pilates, Strength, Cycling, Boxing), bios, and hourly rates.
- **Main Business Rules**:
  - Each class must be assigned to an active trainer.
- **Code Location**: `src/features/trainers/`
- **Dependencies**: Members.

---

## 8. Companies Domain (`src/features/companies`)
- **Owns**: Corporate account partnerships, company credit pools, corporate employee affiliations, and credit pool refills.
- **Main Business Rules**:
  - Employees affiliated with a company can draw from the shared corporate credit pool for class reservations.
- **Code Location**: `src/features/companies/`
- **Dependencies**: Credits, Members.

---

## 9. Reports & Revenue Domain (`src/features/reports`)
- **Owns**: Financial metrics, revenue breakdown (memberships vs credit packs vs corporate contracts), attendance rates, and transaction ledger.
- **Main Business Rules**:
  - Calculates gross studio revenue dynamically from transaction records.
- **Code Location**: `src/features/reports/`
- **Dependencies**: Credits, Bookings.
