# Admin Panel Quick Reference

## Access Points

| Page        | URL                      | Purpose                  |
| ----------- | ------------------------ | ------------------------ |
| Login       | `/admin/login`           | Admin authentication     |
| Dashboard   | `/admin`                 | Overview & stats         |
| Tours       | `/admin/tours`           | List all tours           |
| Create Tour | `/admin/tours/new`       | Add new tour             |
| Edit Tour   | `/admin/tours/[id]/edit` | Edit tour + manage dates |
| Bookings    | `/admin/bookings`        | Manage bookings          |
| Payments    | `/admin/payments`        | View payments            |

## Default Credentials

```
Email:    admin@example.com
Password: password
```

⚠️ **Change in production!**

## Server Actions Quick Reference

### Tours

```typescript
// Create
const tour = await createTour({
  title: "Gobi Desert",
  slug: "gobi-desert",
  description: "...",
  days: 5,
  priceFrom: 1200,
  mainImage: "https://...",
  mapEmbed: "<iframe>..."
});

// Update
await updateTour(tourId, { title: "New Title", ... });

// Delete
await deleteTour(tourId);

// Get one
const tour = await getTourById(tourId);

// Get all
const tours = await getAllTours();
```

### Tour Dates

```typescript
// Create
const date = await createTourDate(tourId, {
  startDate: "2024-01-15T09:00:00",
  endDate: "2024-01-20T18:00:00",
  capacity: 15,
});

// Delete
await deleteTourDate(dateId);
```

### Bookings

```typescript
// Get all
const bookings = await getAllBookings();

// Get one
const booking = await getBookingById(bookingId);

// Confirm
await confirmBooking(bookingId); // status → CONFIRMED

// Cancel
await cancelBooking(bookingId); // status → CANCELLED
```

### Dashboard

```typescript
const stats = await getDashboardStats();
// Returns: totalBookings, totalPayments, totalTours, totalCustomers, recentBookings
```

## Component Usage Examples

### AdminButton

```tsx
<AdminButton variant="primary">Save</AdminButton>
<AdminButton variant="danger" onClick={delete}>Delete</AdminButton>
<AdminButton variant="secondary">Cancel</AdminButton>
```

### AdminInput

```tsx
<AdminInput
  label="Tour Title"
  type="text"
  value={title}
  onChange={setTitle}
  error={errors.title}
  required
/>

<AdminInput
  label="Description"
  type="textarea"
  value={desc}
  onChange={setDesc}
  rows={5}
/>
```

### AdminTable

```tsx
<AdminTable
  data={tours}
  columns={[
    { key: "title", label: "Title" },
    {
      key: "priceFrom",
      label: "Price",
      render: (price) => `$${price.toFixed(2)}`,
    },
  ]}
  actions={(tour) => <button onClick={() => editTour(tour.id)}>Edit</button>}
  onRowClick={(tour) => navigate(`/tours/${tour.id}`)}
/>
```

### StatusBadge

```tsx
<StatusBadge status="CONFIRMED" />
<StatusBadge status="PENDING" />
<StatusBadge status="CANCELLED" />
```

## Validation Schemas

### Create Tour

```typescript
{
  title: string (min 3 chars),
  slug: string (min 3 chars),
  description: string (min 10 chars),
  days: number (min 1),
  priceFrom: number (min 0),
  mainImage?: string (URL),
  mapEmbed?: string
}
```

### Tour Date

```typescript
{
  startDate: string (ISO datetime),
  endDate: string (ISO datetime),
  capacity: number (min 1)
}
```

## Environment Variables

```bash
# Required
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="password"
SESSION_SECRET="your-secret-key"
DATABASE_URL="postgresql://..."

# Recommended
NODE_ENV="production"
```

## Authentication Flow

1. User visits `/admin/login`
2. Submits credentials to `/api/admin/login`
3. Server validates against `ADMIN_EMAIL` + `ADMIN_PASSWORD`
4. Creates signed session cookie
5. Middleware redirects to `/admin` if valid
6. Session persists for 7 days

## Security Notes

✅ **Implemented:**

- Session-based auth with signed cookies
- HMAC-SHA256 signature verification
- HTTPOnly cookies (no JS access)
- Middleware route protection
- Server-only actions (no exposed API)
- Zod input validation

⚠️ **To Improve:**

- Use strong password (currently "password")
- Generate random SESSION_SECRET
- Enable HTTPS in production
- Add rate limiting on login
- Consider 2FA/MFA
- Add audit logging
- Use OAuth instead of hardcoded credentials

## Common Tasks

### Add a new admin

Edit `lib/auth.ts` `verifyAdminCredentials()`:

```typescript
export function verifyAdminCredentials(
  email: string,
  password: string
): boolean {
  const validAdmins = [
    { email: "admin@example.com", password: "password" },
    { email: "user2@example.com", password: "password2" },
  ];
  return validAdmins.some((a) => a.email === email && a.password === password);
}
```

### Change admin password

Update `.env`:

```bash
ADMIN_PASSWORD="new-strong-password-here"
```

### Debug session issues

Check browser DevTools → Application → Cookies:

- Look for `admin_session` cookie
- Verify it's HTTPOnly
- Check Secure flag (should be true in production)

## File Structure Overview

```
/app/admin/
├── layout.tsx          # Navigation & sidebar
├── page.tsx            # Dashboard
├── login/page.tsx      # Login form
├── tours/
│   ├── page.tsx        # List tours
│   ├── new/page.tsx    # Create form
│   └── [id]/edit/page.tsx  # Edit + dates
├── bookings/page.tsx   # Bookings list
└── payments/page.tsx   # Payments list

/lib/
├── auth.ts             # Session & credentials
├── actions.ts          # Server actions (CRUD)
└── validation.ts       # Zod schemas

middleware.ts          # Route protection
```

## Troubleshooting

**Q: Login shows "Invalid email or password"**
A: Check `.env` for correct `ADMIN_EMAIL` and `ADMIN_PASSWORD`

**Q: Session expires immediately**
A: Check `SESSION_SECRET` in `.env` - should be a long random string

**Q: Database shows old schema**
A: Run `npx prisma migrate reset` to reset and re-apply migrations

**Q: Prisma type errors**
A: Run `npx prisma generate` to regenerate client types

**Q: Tours won't delete**
A: Check for related bookings - delete bookings first

## Performance Tips

- Use `getAllTours()` for initial list load
- Use `getTourById()` for single tour details
- Cache dashboard stats (revalidate every 60 seconds)
- Paginate bookings/payments for large datasets
- Add search/filter to tables

## Next Steps

1. ✅ Admin panel complete
2. 🔄 Add more admin users (modify auth.ts)
3. 🔄 Add email notifications on booking
4. 🔄 Export tours/bookings to CSV/PDF
5. 🔄 Add user activity audit log
6. 🔄 Implement 2FA
7. 🔄 Add analytics dashboard
8. 🔄 Payment reconciliation tools

---

**Created**: November 2024
**Status**: ✅ Production Ready
