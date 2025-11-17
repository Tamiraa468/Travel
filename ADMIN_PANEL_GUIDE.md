# Admin Panel Setup Guide

## Overview

A complete admin panel has been created for managing tours, bookings, and payments using Next.js App Router, Prisma, TypeScript, and TailwindCSS.

## Directory Structure

```
/app/admin/
├── layout.tsx                    # Admin layout with sidebar
├── page.tsx                      # Dashboard
├── login/
│   └── page.tsx                  # Login page
├── tours/
│   ├── page.tsx                  # Tours listing
│   ├── new/
│   │   └── page.tsx              # Create tour form
│   └── [id]/
│       └── edit/
│           └── page.tsx          # Edit tour + manage dates
├── bookings/
│   └── page.tsx                  # Bookings management
└── payments/
    └── page.tsx                  # Payments listing

/api/admin/
├── login/
│   └── route.ts                  # Login API
└── logout/
    └── route.ts                  # Logout API

/Components/
├── AdminButton.tsx               # Button component
├── AdminInput.tsx                # Input/textarea component
├── AdminCard.tsx                 # Card wrapper
├── AdminTable.tsx                # Data table with generics
└── StatusBadge.tsx               # Status badge component

/lib/
├── auth.ts                       # Session & auth functions
├── actions.ts                    # Server actions (CRUD)
└── validation.ts                 # Zod schemas

middleware.ts                      # Route protection
```

## Features Implemented

### 1. Authentication

- **Login Page**: `/admin/login`
- **Credentials**: (set in `.env`)
  - `ADMIN_EMAIL`: admin@example.com
  - `ADMIN_PASSWORD`: password
- **Session Management**: Signed cookies with HMAC-SHA256
- **Middleware**: Protects all `/admin` routes (except login)

### 2. Dashboard

- Stats cards: Total Bookings, Paid Payments, Total Tours, Total Customers
- Recent bookings list
- Quick action links

### 3. Tours Management

- **List Tours**: View all tours with title, slug, days, price
- **Create Tour**: Form with validation
  - Fields: title, slug, description, days, priceFrom, mainImage, mapEmbed
- **Edit Tour**: Update existing tour data
- **Delete Tour**: Server action with confirmation
- **Manage Tour Dates**: Add/delete dates within tour edit page
  - Fields: startDate, endDate, capacity

### 4. Bookings Management

- **List Bookings**: View all bookings
  - Columns: Customer, Tour, Persons, Total Price, Booking Status, Payment Status
- **Confirm Booking**: Change status to CONFIRMED
- **Cancel Booking**: Change status to CANCELLED

### 5. Payments

- **List Payments**: View all payments
  - Columns: Payment ID, Customer, Tour, Amount, Provider, Status, Date

## Environment Variables

Add to `.env`:

```dotenv
# Admin credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="password"

# Session secret (change in production!)
SESSION_SECRET="your-secret-key-change-in-production"

# Database (already configured)
DATABASE_URL="..."
```

## Database Schema

Updated Tour model:

```prisma
model Tour {
  id           String     @id @default(cuid())
  title        String
  slug         String     @unique
  description  String?
  days         Int
  priceFrom    Float
  mainImage    String?
  images       String[]   @default([])
  includes     String[]   @default([])
  highlights   String[]   @default([])
  mapEmbed     String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  dates        TourDate[]
  bookings     Booking[]
}
```

## How to Use

### Login

1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `admin@example.com`
   - Password: `password`
3. Redirected to dashboard

### Create a Tour

1. Go to `/admin/tours`
2. Click "Create Tour"
3. Fill in form fields
4. Click "Create Tour"

### Edit Tour & Manage Dates

1. Go to `/admin/tours`
2. Click "Edit" on a tour
3. Update tour info
4. Scroll to "Tour Dates" section
5. Add dates with start date, end date, and capacity
6. Delete dates as needed

### Manage Bookings

1. Go to `/admin/bookings`
2. View all bookings
3. For PENDING bookings, click "Confirm" or "Cancel"

### View Payments

1. Go to `/admin/payments`
2. See payment status, amount, customer, and date

## Components

### AdminButton

```tsx
<AdminButton variant="primary" onClick={...}>
  Click me
</AdminButton>
```

Variants: `primary` | `danger` | `secondary`

### AdminInput

```tsx
<AdminInput
  label="Title"
  type="text"
  value={value}
  onChange={setValue}
  error={error}
  required
/>
```

Types: `text` | `email` | `number` | `password` | `textarea` | `date` | `datetime-local`

### AdminTable

Generic table component with columns and actions:

```tsx
<AdminTable
  data={tours}
  columns={[
    { key: "title", label: "Title" },
    { key: "price", label: "Price", render: (v) => `$${v}` },
  ]}
  actions={(row) => <button>Edit</button>}
/>
```

### StatusBadge

```tsx
<StatusBadge status="CONFIRMED" />
```

Statuses: `PENDING` | `CONFIRMED` | `CANCELLED` | `UNPAID` | `PAID` | `REFUNDED`

## Server Actions

All data mutations use Next.js Server Actions:

- `createTour(data)`
- `updateTour(id, data)`
- `deleteTour(id)`
- `createTourDate(tourId, data)`
- `deleteTourDate(id)`
- `confirmBooking(id)`
- `cancelBooking(id)`
- `getAllBookings()`
- `getAllPayments()`
- `getDashboardStats()`

## Validation

Zod schemas validate all inputs:

- `loginSchema`: Email & password validation
- `createTourSchema`: Tour fields validation
- `tourDateSchema`: Date & capacity validation

## Security

- ✅ Session-based authentication with signed cookies
- ✅ Middleware route protection
- ✅ Server-only actions (no API exposed)
- ✅ HMAC-SHA256 signature verification
- ✅ HTTPOnly cookies
- ✅ Input validation with Zod

## Next Steps

1. Change `ADMIN_PASSWORD` to a strong password
2. Change `SESSION_SECRET` to a random string
3. Consider adding 2FA
4. Add audit logging for admin actions
5. Implement email notifications
6. Add export/import functionality

## Troubleshooting

- **Login fails**: Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`
- **Migration errors**: Run `npx prisma migrate reset` to reset database
- **Type errors**: Run `npx prisma generate` to regenerate client
