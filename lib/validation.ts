import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createTourSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  days: z.number().int().min(1, "Days must be at least 1"),
  priceFrom: z.number().min(0, "Price must be positive"),
  mainImage: z.string().optional().or(z.literal("")).nullable(),
  mainImageUrl: z
    .string()
    .url("Invalid image URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  images: z.array(z.string()).default([]),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  mapEmbed: z.string().optional().or(z.literal("")).nullable(),
  season: z.string().optional().or(z.literal("")).nullable(),
  groupSize: z.string().optional().or(z.literal("")).nullable(),
  activityLevel: z.string().optional().or(z.literal("")).nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().optional().or(z.literal("")).nullable(),
});

export const updateTourSchema = createTourSchema.partial().extend({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  slug: z.string().min(3, "Slug must be at least 3 characters").optional(),
});

export const tourDateSchema = z.object({
  startDate: z.string().datetime("Invalid date format"),
  endDate: z.string().datetime("Invalid date format"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTourInput = z.infer<typeof createTourSchema>;
export type UpdateTourInput = z.infer<typeof updateTourSchema>;
export type TourDateInput = z.infer<typeof tourDateSchema>;

// RequestInfo validation schema (Legacy - kept for backward compatibility)
export const requestInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional().or(z.literal("")),
  preferredStartDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional()
    .or(z.literal("")),
  adults: z.number().int().min(1, "Must have at least 1 adult").default(1),
  children: z
    .number()
    .int()
    .min(0, "Children count cannot be negative")
    .default(0),
  message: z.string().max(1000).optional().or(z.literal("")),
  tourId: z.string().optional().or(z.literal("")),
  tourName: z.string().optional().or(z.literal("")),
  marketingConsent: z.boolean().default(false),
  hp: z.string().optional().or(z.literal("")), // Honeypot field
});

export type RequestInfoInput = z.infer<typeof requestInfoSchema>;

// ============================================
// INQUIRY SCHEMA (New Inquiry-First Sales Model)
// ============================================
// This schema validates lead/inquiry submissions.
// NO payment or booking is created - just a qualified lead.
// Human agents follow up to close deals personally.
// ============================================
export const inquirySchema = z.object({
  // Required fields
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),

  // Optional contact/preference fields
  phone: z.string().max(30).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  travelMonth: z.string().max(50).optional().or(z.literal("")),
  groupSize: z.string().max(50).optional().or(z.literal("")),
  budgetRange: z.string().max(100).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),

  // Tour reference (optional)
  tourId: z.string().optional().or(z.literal("")),
  tourName: z.string().optional().or(z.literal("")),

  // Consent & tracking
  marketingConsent: z.boolean().default(false),
  source: z.string().optional().or(z.literal("")),

  // Honeypot (anti-bot)
  hp: z.string().optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// Admin: Send Payment Link schema
export const sendPaymentLinkSchema = z.object({
  inquiryId: z.string().min(1, "Inquiry ID is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("USD"),
  description: z.string().optional(),
  paymentMethod: z.enum(["stripe", "bank_transfer"]),
});

export type SendPaymentLinkInput = z.infer<typeof sendPaymentLinkSchema>;

// Admin: Update Inquiry Status schema
export const updateInquiryStatusSchema = z.object({
  inquiryId: z.string().min(1, "Inquiry ID is required"),
  leadStatus: z.enum([
    "NEW",
    "CONTACTED",
    "QUOTED",
    "NEGOTIATING",
    "WON",
    "LOST",
    "ON_HOLD",
  ]),
  internalNotes: z.string().optional(),
  quotedPrice: z.number().optional(),
  assignedTo: z.string().optional(),
});

export type UpdateInquiryStatusInput = z.infer<
  typeof updateInquiryStatusSchema
>;
