import { z } from "zod";

// 10-digit phone number (Indian standard format: 10 digits, starts with 6-9)
export const phoneRegex = /^[6-9]\d{9}$/;

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Must be a valid 10-digit mobile number (e.g. 9876543210)"),
});

export const ledgerEntrySchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  type: z.enum(["CREDIT_GIVEN", "PAYMENT_RECEIVED"], {
    errorMap: () => ({ message: "Entry type must be Credit Given or Payment Received" }),
  }),
  // amount in Rupees (positive decimal or integer, up to 2 decimal places)
  amountRupees: z
    .number({ invalid_type_error: "Please enter a valid amount" })
    .positive("Amount must be greater than zero")
    .max(1000000, "Amount cannot exceed ₹10,00,000 in a single entry"),
  note: z.string().trim().max(200, "Note cannot exceed 200 characters").optional(),
  allowNegativeBalance: z.boolean().optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type LedgerEntryInput = z.infer<typeof ledgerEntrySchema>;
