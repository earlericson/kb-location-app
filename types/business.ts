import { z } from "zod";
import { Timestamp } from "firebase/firestore";

// 1. The Schema (For Form Validation & Coercion)
export const BusinessSchema = z.object({
  id: z.string().optional(),
  businessName: z.string().min(2, "Business Name is required"),
  businessOwner: z.string().min(2, "Business Owner is required"),
  phone: z.string().min(5, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  email: z.string().email("Invalid email address"),
  // imageUrl: z.string().min(1, "Please upload a business image"),
  imageUrl: z.string().optional(),
  latitude: z.number({ message: "Latitude is required" })
    .min(-90)
    .max(90),
  longitude: z.number({ message: "Longitude is required" })
    .min(-180)
    .max(180),
  // .optional() allows it to be missing
  // .or(z.literal("")) allows the input to be an empty string without error
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
  contentUrl: z.string().url("Invalid content URL").optional().or(z.literal("")),
  // status: z.enum(["Active", "For Sale", "Available"])
  //   .catch("Available"), // If the input is invalid, default to 'Available' instead of crashing
  // The most robust way to handle requirements AND custom errors:
  status: z.string().refine((val) => ["active", "forsale", "available"].includes(val), {
    message: "Please select a valid status",
  }),
  isSynced: z.boolean().catch(false),
});

// 2. The Form Values Type (Inferred from Schema)
export type BusinessFormValues = z.infer<typeof BusinessSchema>;

// 3. The Database Interface (Final Data Structure)
export interface BusinessLocation extends BusinessFormValues {
  id: string;
  createdAt: Timestamp; // Firestore Timestamp
  // createdAt: any; 
}