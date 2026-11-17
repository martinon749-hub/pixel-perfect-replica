import { z } from "zod";

// Honeypot: real visitors never see or fill this field.
const honeypot = z.string().max(0).optional().or(z.literal(""));

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(255),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you'd like to receive our emails" }) }),
  company: honeypot,
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(255),
  subject: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().min(10, "Please write at least a few words").max(3000, "Please keep it under 3,000 characters"),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to the privacy policy" }) }),
  company: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;
