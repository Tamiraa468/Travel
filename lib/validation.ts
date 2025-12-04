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
  mainImage: z
    .string()
    .url("Invalid image URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  images: z.array(z.string().url()).default([]),
  includes: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  mapEmbed: z.string().optional().or(z.literal("")).nullable(),
});

export const updateTourSchema = createTourSchema;

export const tourDateSchema = z.object({
  startDate: z.string().datetime("Invalid date format"),
  endDate: z.string().datetime("Invalid date format"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTourInput = z.infer<typeof createTourSchema>;
export type UpdateTourInput = z.infer<typeof updateTourSchema>;
export type TourDateInput = z.infer<typeof tourDateSchema>;

// RequestInfo validation schema
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
