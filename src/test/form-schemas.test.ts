import { describe, expect, it } from "vitest";
import { contactSchema, newsletterSchema } from "@/lib/form-schemas";

describe("newsletter sign-up rules", () => {
  it("requires explicit consent before storing an email", () => {
    expect(newsletterSchema.safeParse({ email: "ruth@example.co.uk", consent: false }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: "ruth@example.co.uk", consent: true }).success).toBe(true);
  });

  it("rejects an invalid email address", () => {
    expect(newsletterSchema.safeParse({ email: "not-an-email", consent: true }).success).toBe(false);
  });
});

describe("contact form rules", () => {
  const valid = { name: "Amir", email: "amir@example.co.uk", message: "Hello, love the channel!", consent: true };

  it("accepts a complete message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("requires privacy consent", () => {
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("caps messages at 3,000 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(3001) }).success).toBe(false);
  });

  it("rejects submissions where the hidden spam field is filled", () => {
    expect(contactSchema.safeParse({ ...valid, company: "spam-bot ltd" }).success).toBe(false);
  });
});
