import { z } from "zod";

// 1. The Schema (For Form Validation & Coercion)
export const BusinessSchema = z.object({
  businessName: z.string().min(2, "Name is required"),
  phone: z.string().min(5, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  email: z.string().email("Invalid email address"),
  imageUrl: z.string().url("Invalid image URL"),
  // latitude: z.string().min(5, "latitude required"),
  // longitude: z.string().min(5, "longitude required"),
  // latitude: z.coerce.number().min(-90).max(90),   // Coerces string to number
  // longitude: z.coerce.number().min(-180).max(180), // Coerces string to number
  latitude: z.number({ message: "Latitude is required" })
    .min(-90)
    .max(90),
  longitude: z.number({ message: "Longitude is required" })
    .min(-180)
    .max(180),
  websiteUrl: z.string().url("Invalid website URL"),
  contentUrl: z.string().url("Invalid content URL"),
});

// 2. The Form Values Type (Inferred from Schema)
export type BusinessFormValues = z.infer<typeof BusinessSchema>;

// 3. The Database Interface (Final Data Structure)
export interface BusinessLocation extends BusinessFormValues {
  id: string;
  createdAt: any; // Firestore Timestamp
}