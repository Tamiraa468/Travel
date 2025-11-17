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
