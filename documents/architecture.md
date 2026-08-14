# FlexFit Studio — System Architecture & Design Document

## Executive Summary

FlexFit Studio is a production-grade gym management application built on Next.js 15, TypeScript, tRPC v11, Drizzle ORM, SQLite (with WAL mode), and Tailwind CSS. The codebase is organized around strict domain-driven boundaries and single-responsibility principles.

---

## High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 15 App Router                           │
│  (dashboard)/                                                          │
│   ├── page.tsx (Dashboard Overview)                                    │
│   ├── members/page.tsx (Members Roster)                                │
│   ├── bookings/page.tsx (Classes & Booking Modal)                      │
│   ├── front-desk/page.tsx (Check-In Desk)                              │
│   ├── trainers/page.tsx (Trainers Roster)                              │
│   ├── companies/page.tsx (Corporate Pools)                             │
│   └── reports/page.tsx (Revenue Reports)                               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          tRPC API Layer                                │
│  src/server/trpc/root.ts                                               │
│   ├── members, memberships, credits, bookings, waitlists,              │
│   └── frontDesk, trainers, companies, reports                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Domain Services Layer                            │
│  src/features/                                                         │
│   ├── <domain>/<domain>.service.ts (Authoritative Business Logic)       │
│   └── <domain>/<domain>.schemas.ts (Zod Validation)                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Domain Repository Layer                           │
│  src/features/<domain>/<domain>.repository.ts (Drizzle Queries)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Drizzle ORM & SQLite Storage                          │
│  src/server/db/schema/index.ts & SQLite WAL Database (`sqlite.db`)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure Overview

```
src/
├── app/                      # Next.js App Router (Presentation Layer)
│   ├── (dashboard)/
│   │   ├── members/
│   │   ├── bookings/
│   │   ├── front-desk/
│   │   ├── trainers/
│   │   ├── companies/
│   │   └── reports/
│   └── api/trpc/[trpc]/
│
├── features/                 # Domain-Driven Core Modules
│   ├── members/              # Member management & personal profiles
│   ├── memberships/          # Plan definitions & credit allocations
│   ├── credits/              # Central credit balance & deduction rules
│   ├── bookings/             # Capacity checks & reservation rules
│   ├── waitlists/            # Queue position & auto-promotion
│   ├── front-desk/           # Quick check-in workflows
│   ├── trainers/             # Trainer staff & specialty mappings
│   ├── companies/            # Corporate credit pool accounts
│   └── reports/              # Revenue analytics & audit ledger
│
├── server/
│   ├── db/                   # Drizzle ORM setup & SQLite connection
│   │   ├── schema/           # Typed database tables
│   │   └── seed.ts           # Realistic database seeding
│   └── trpc/                 # tRPC root and domain procedures
│
├── components/               # UI components
│   ├── ui/                   # Reusable atomic UI (Button, Card, Badge, Modal)
│   ├── layout/               # Sidebar, Header, DashboardLayout
│   └── shared/               # PageHeader, SearchInput
│
└── lib/                      # Core utility functions
    ├── date.ts               # Date math & formatting
    ├── formatting.ts         # Currency & badge variant rules
    ├── permissions.ts        # Role-based permission checks
    └── trpc/                 # Client TRPCProvider & React Query setup
```

---

## Layer Responsibilities & Dependency Rules

1. **UI Layer (`src/app`, `src/components`)**: Pure presentation and user interactivity. Client Components (`"use client"`) are used strictly for stateful modals, forms, and tRPC query hooks. No direct SQL or credit math exists inside UI files.
2. **tRPC Layer (`src/server/trpc`)**: Thin router handlers that validate inputs with Zod schemas and delegate immediately to domain services.
3. **Service Layer (`src/features/<domain>/<domain>.service.ts`)**: Contains authoritative business rules (e.g., credit deduction logic, capacity enforcement, waitlist auto-promotion).
4. **Repository Layer (`src/features/<domain>/<domain>.repository.ts`)**: Encapsulates all Drizzle ORM database queries.
5. **Database Schema Layer (`src/server/db/schema/index.ts`)**: Authoritative database table structures using SQLite.

---

## Unidirectional Dependency Direction

```
UI Component → tRPC Procedure → Domain Service → Domain Repository → Database Schema
```
- Modules NEVER violate dependency hierarchy (e.g., Database schemas do not import UI components).
