# Request Info Feature - Complete Implementation Guide

## Overview

The Request Info feature allows visitors to request information about tours and book inquiries. The system includes:

- Prisma database model for storing requests
- RESTful API endpoint with validation and bot protection
- Responsive form component with client-side validation
- Email notifications (user confirmation + internal notification)
- Rate limiting to prevent abuse
- Complete TypeScript support

---

## Architecture

### Database Model

**Location:** `db/schema.prisma`

```prisma
model RequestInfo {
  id                 String   @id @default(cuid())
  fullName           String
  email              String
  phone              String?
  preferredStartDate DateTime?
  adults             Int      @default(1)
  children           Int      @default(0)
  message            String?
  tourId             String?
  tourName           String?
  marketingConsent   Boolean  @default(false)
  createdAt          DateTime @default(now())

  @@index([email])
  @@index([createdAt])
}
```

### API Endpoint

**Location:** `app/api/request-info/route.ts`

**Method:** `POST /api/request-info`

**Request Body:**

```typescript
{
  fullName: string (required)
  email: string (required)
  phone?: string
  preferredStartDate?: ISO8601 datetime string
  adults: number (default: 1)
  children: number (default: 0)
  message?: string (max 1000 chars)
  tourId?: string
  tourName?: string
  marketingConsent: boolean (default: false)
  hp: string (honeypot field - leave empty)
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "id": "cuid_value",
  "message": "Your request has been received. We will contact you soon."
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Error message describing the issue"
}
```

**Status Codes:**

- `200`: Success
- `400`: Validation error
- `409`: Duplicate email (if constraint exists)
- `429`: Rate limit exceeded (10 requests/IP/minute)
- `500`: Server error

---

## Features

### 1. Bot Protection (Honeypot)

- Hidden input field `hp` (display: none)
- If filled by bot, request is silently rejected
- Returns success response to confuse bots

### 2. Input Validation

- Client-side validation in form component
- Server-side validation using Zod schema
- Email format validation
- Adult count must be >= 1
- Children count must be >= 0

### 3. Email Notifications

#### User Confirmation Email

- HTML formatted
- Lists tour name, travelers, preferred date
- Professional branding
- Reassures user about response time

#### Internal Notification Email

- Sent to `ADMIN_EMAIL`
- Includes all request details in table format
- Marketing consent status
- Actionable for team response

**Configuration (`.env`):**

```
EMAIL_USER=noreply@tourismplatform.com
EMAIL_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ADMIN_EMAIL=admin@yourcompany.com
```

### 4. Rate Limiting

- Limit: 10 requests per IP per 60 seconds
- Applied via middleware at `/api/request-info`
- Returns 429 status when exceeded
- In-memory tracking (resets on server restart)

### 5. Form Component

**Location:** `Components/RequestInfoForm.tsx`

**Features:**

- Fully controlled inputs
- Real-time character counter
- Loading/success/error states
- Auto-reset on successful submission
- Responsive design (TailwindCSS)
- Accessibility labels
- Privacy notice

**Usage:**

```tsx
import RequestInfoForm from "@/Components/RequestInfoForm";

export default function MyPage() {
  return (
    <RequestInfoForm
      tourId="optional-tour-id"
      tourName="Optional Tour Name"
      className="custom-styles"
    />
  );
}
```

---

## Database Setup

### 1. Add Migration

The migration was automatically created:

```
db/migrations/20251122060558_add_request_info_model/
```

### 2. Schema Generation

Prisma client was regenerated:

```bash
npx prisma generate --schema=db/schema.prisma
```

### 3. Database Tables

The migration creates the `RequestInfo` table with:

- Composite indexes on `(email)` and `(createdAt)`
- All required and optional fields
- Proper datetime handling

---

## Email Configuration

### Setup for Gmail (with App Password)

1. Enable 2-Factor Authentication in Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Add to `.env`:
   ```
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

### Alternative: Other SMTP Providers

**SendGrid:**

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxx
```

**Mailgun:**

```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
EMAIL_USER=postmaster@yourdomain.com
EMAIL_PASSWORD=your_mailgun_password
```

---

## Integration Examples

### 1. On Tour Detail Page

```tsx
// app/tours/[slug]/page.tsx
import RequestInfoForm from "@/Components/RequestInfoForm";

export default function TourDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tour = await getTourBySlug(params.slug);

  return (
    <div>
      <TourHeader tour={tour} />
      <TourDescription tour={tour} />

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Interested in this tour?</h2>
          <RequestInfoForm tourId={tour.id} tourName={tour.title} />
        </div>
      </section>
    </div>
  );
}
```

### 2. Standalone Request Page

```tsx
// app/request-info/page.tsx
import RequestInfoForm from "@/Components/RequestInfoForm";

export default function RequestInfoPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Request Tour Information</h1>
      <RequestInfoForm />
    </div>
  );
}
```

### 3. Modal/Dialog Integration

```tsx
"use client";

import { useState } from "react";
import RequestInfoForm from "@/Components/RequestInfoForm";

export function TourRequestModal({
  tourId,
  tourName,
}: {
  tourId: string;
  tourName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Request Info</button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{tourName}</h2>
            <RequestInfoForm tourId={tourId} tourName={tourName} />
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## Testing

### Manual Testing Checklist

- [ ] Form validates empty fields
- [ ] Form validates email format
- [ ] Form allows valid submissions
- [ ] Success message appears after submission
- [ ] Form resets after success
- [ ] Rate limiting blocks after 10 requests
- [ ] Honeypot field prevents bot submissions
- [ ] User confirmation email received
- [ ] Internal notification email received

### cURL Test

```bash
curl -X POST http://localhost:3000/api/request-info \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "adults": 2,
    "children": 1,
    "message": "Looking for adventure!",
    "tourName": "Gobi Desert Tour",
    "marketingConsent": true,
    "hp": ""
  }'
```

### Rate Limit Test

```bash
# Run 11 times to exceed limit
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/request-info \
    -H "Content-Type: application/json" \
    -d '{"fullName":"Test","email":"test@example.com","hp":""}'
  echo "Request $i"
  sleep 0.1
done
```

---

## Environment Variables

Required in `.env`:

```env
# Database
DATABASE_URL="prisma+postgres://..."

# Email Configuration
EMAIL_USER="your.email@gmail.com"
EMAIL_PASSWORD="xxxx xxxx xxxx xxxx"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
ADMIN_EMAIL="admin@tourcompany.com"
```

---

## File Structure

```
project/
├── app/
│   ├── api/
│   │   └── request-info/
│   │       └── route.ts          # API endpoint
│   ├── request-info/
│   │   └── page.tsx              # Example page
│   └── ...
├── Components/
│   ├── RequestInfoForm.tsx       # Form component
│   └── ...
├── lib/
│   ├── email.ts                  # Email helper
│   ├── validation.ts             # Zod schemas
│   └── ...
├── db/
│   ├── schema.prisma             # Prisma schema
│   └── migrations/
│       └── 20251122060558_add_request_info_model/
│           └── migration.sql
├── middleware.ts                 # Rate limiting
└── .env                          # Environment variables
```

---

## Troubleshooting

### Issue: Emails not sending

**Solution:**

1. Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
2. For Gmail, verify App Password is 16 characters
3. Check SMTP_HOST and SMTP_PORT are correct
4. Enable "Less secure app access" if needed
5. Check firewall allows port 587

### Issue: Rate limiting not working

**Solution:**

- Rate limiter is in-memory, resets on server restart
- For production, consider using Redis or similar
- Check middleware matcher includes `/api/request-info`

### Issue: Form not submitting

**Solution:**

1. Check browser console for errors
2. Verify API endpoint is accessible: `/api/request-info`
3. Check Content-Type header is `application/json`
4. Ensure CORS is not blocking (should be same origin)

### Issue: Validation failing

**Solution:**

- Check Zod schema in `lib/validation.ts`
- Ensure email format is valid
- Verify required fields are provided
- Check optional fields are not over max lengths

---

## Performance Notes

- **Rate Limiting:** In-memory tracking is suitable for single-server deployments. For multi-server production, use Redis.
- **Email Sending:** Async, doesn't block response. Failures are logged but don't fail the request.
- **Database Indexing:** Indexes on `email` and `createdAt` for quick lookups.

---

## Security Considerations

✓ Honeypot field prevents basic bots  
✓ Rate limiting prevents abuse (10 req/IP/min)  
✓ Server-side validation (don't trust client)  
✓ SQL injection prevention (Prisma parameterized queries)  
✓ XSS prevention (React escaping, TailwindCSS)  
✓ CSRF protection (Next.js built-in)

For production:

- Use HTTPS
- Add CORS restrictions
- Implement CAPTCHA for additional bot protection
- Consider email verification
- Add admin dashboard to view/manage requests

---

## API Response Examples

### Success Response

```json
{
  "success": true,
  "id": "clwh7x1z80001nzzz9z9z9z9z",
  "message": "Your request has been received. We will contact you soon."
}
```

### Validation Error

```json
{
  "success": false,
  "error": "Invalid email address"
}
```

### Rate Limit Error

```json
{
  "success": false,
  "error": "Too many requests. Please try again in a minute."
}
```

### Duplicate Email Error

```json
{
  "success": false,
  "error": "This email has already submitted a request. Please wait for our response."
}
```

---

## Database Query Examples

### View all requests

```typescript
const requests = await prisma.requestInfo.findMany({
  orderBy: { createdAt: "desc" },
});
```

### Get requests for specific tour

```typescript
const tourRequests = await prisma.requestInfo.findMany({
  where: { tourId: "tour-id" },
  orderBy: { createdAt: "desc" },
});
```

### Get requests from past 7 days

```typescript
const recentRequests = await prisma.requestInfo.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  },
});
```

---

## Future Enhancements

- [ ] Add email verification
- [ ] Implement CAPTCHA
- [ ] Add admin dashboard for viewing requests
- [ ] Export requests to CSV
- [ ] Automated follow-up emails
- [ ] Request status tracking (new, contacted, booked)
- [ ] SMS notifications for urgent requests
- [ ] Integration with CRM system
- [ ] Multi-language support
- [ ] SMS verification option

---

**Created:** November 22, 2025  
**Version:** 1.0.0  
**Status:** Production Ready
