import { z } from "zod";

// 1. The Schema (For Form Validation & Coercion)
export const BusinessSchema = z.object({
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
  // status: z.string().catch,
  status: z.enum(["draft", "published"]).catch("draft"),
});

// 2. The Form Values Type (Inferred from Schema)
export type BusinessFormValues = z.infer<typeof BusinessSchema>;

// 3. The Database Interface (Final Data Structure)
export interface BusinessLocation extends BusinessFormValues {
  id: string;
  createdAt: any; // Firestore Timestamp
}