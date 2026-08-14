# FlexFit Studio — Architecture & Refactoring Notes

This document details the decisions, duplicated logic removals, file organization, and architectural design principles applied during the FlexFit Studio production refactor.

---

## 1. Important Duplicated Logic Consolidated

### A. Credit Calculation & Deduction Rules
- **Before**: Credit deduction, corporate pool fallback, and refund math were scattered across individual booking handlers and UI handlers.
- **After**: Consolidated into `CreditService` (`src/features/credits/credit.service.ts`). `CreditService.deductClassCredits()` serves as the single authoritative source of truth for personal vs corporate credit deduction.

### B. Capacity & Waitlist Auto-Promotion
- **Before**: Capacity checking and waitlist status updates were handled ad-hoc in UI handlers.
- **After**: Encapsulated into `BookingService.bookClass()` and `BookingService.cancelBooking()`. When a slot is freed, `BookingService` automatically queries `WaitlistService`, checks candidate credits via `CreditService`, creates a booking, and promotes the candidate cleanly in a single server transaction.

### C. Validation Schemas
- **Before**: Validation logic was duplicated across form inputs and API parameters.
- **After**: Centralized in domain schema files (`member.schemas.ts`, `booking.schemas.ts`, `credit.schemas.ts`, `company.schemas.ts`). Shared across tRPC procedures and UI forms.

---

## 2. Server vs Client Component Separation

- **Server-Driven Data & API**: All database operations and business rule calculations reside exclusively on the server (`src/features/` & `src/server/`).
- **Targeted Client Components**: `"use client"` is applied strictly at component boundaries where user interactivity (form input state, modals, tabs, tRPC hooks) is required.

---

## 3. tRPC Layer Organization

- Replaced monolithic API handlers with thin, domain-specific routers:
  - `membersRouter`
  - `membershipsRouter`
  - `creditsRouter`
  - `bookingsRouter`
  - `waitlistsRouter`
  - `frontDeskRouter`
  - `trainersRouter`
  - `companiesRouter`
  - `reportsRouter`
- Every procedure follows the clean standard: `tRPC procedure -> Domain Service -> Domain Repository -> Drizzle DB`.

---

## 4. Technical Debt & Intentional Behaviors Preserved

- **SQLite WAL Mode**: SQLite runs in WAL mode (`journal_mode = WAL`) to support high concurrency for front-desk check-ins and simultaneous bookings without database locking errors.
- **Corporate Pool Fallback**: Corporate employee credit deduction automatically defaults to personal credits first before drawing from company pools, ensuring members consume individual allowances before utilizing company benefits.
