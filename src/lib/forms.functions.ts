import { createServerFn } from "@tanstack/react-start";
import { contactSchema, newsletterSchema } from "./form-schemas";

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => newsletterSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.company) return { ok: true as const }; // silently drop bots
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert({ email: data.email, source: "website" }, { onConflict: "email", ignoreDuplicates: true });
    if (error) {
      console.error("newsletter insert failed", error);
      throw new Error("We couldn't save your sign-up just now. Please try again.");
    }
    return { ok: true as const };
  });

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.company) return { ok: true as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject || "General enquiry",
      message: data.message,
    });
    if (error) {
      console.error("contact insert failed", error);
      throw new Error("We couldn't send your message just now. Please try again.");
    }
    return { ok: true as const };
  });
