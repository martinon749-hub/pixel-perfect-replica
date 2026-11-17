import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Youtube } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/sections";
import { contactSchema } from "@/lib/form-schemas";
import { sendContactMessage } from "@/lib/forms.functions";
import { YOUTUBE_URL } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Couple of Dumpsters" },
      { name: "description", content: "Get in touch with Amir and Ruth at Couple of Dumpsters. Questions, collaborations or tips on where to dive next." },
      { property: "og:title", content: "Contact — Couple of Dumpsters" },
      { property: "og:description", content: "Get in touch with Amir and Ruth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

type Errors = Partial<Record<"name" | "email" | "message" | "consent" | "form", string>>;

function ContactPage() {
  const send = useServerFn(sendContactMessage);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject") ?? "",
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      company: fd.get("company") ?? "",
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await send({ data: parsed.data });
      setSent(true);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow="Contact" title="Say hello." intro="Questions, ideas, or a tip on where we should dive next? Send us a message." />
      <section className="container-page grid gap-14 py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {sent ? (
            <div className="rounded-2xl border border-border bg-paper p-10" role="status">
              <CheckCircle2 className="size-10 text-forest" aria-hidden />
              <h2 className="mt-5 text-3xl">Thanks, your message is with us.</h2>
              <p className="mt-3 text-lg text-muted-foreground">We read every message and reply when we can.</p>
              <Button variant="quiet" className="mt-8 rounded-full" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="name" label="Your name" error={errors.name}>
                  <Input id="name" name="name" autoComplete="name" required className="h-12 bg-paper" aria-invalid={!!errors.name} />
                </Field>
                <Field id="email" label="Email address" error={errors.email}>
                  <Input id="email" name="email" type="email" autoComplete="email" required className="h-12 bg-paper" aria-invalid={!!errors.email} />
                </Field>
              </div>
              <Field id="subject" label="Subject (optional)">
                <Input id="subject" name="subject" maxLength={150} className="h-12 bg-paper" />
              </Field>
              <Field id="message" label="Message" error={errors.message}>
                <Textarea id="message" name="message" rows={7} maxLength={3000} required className="bg-paper" aria-invalid={!!errors.message} />
              </Field>
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <div>
                <label className="flex items-start gap-3 text-sm text-foreground/80">
                  <input type="checkbox" name="consent" className="mt-0.5 size-4 accent-[var(--forest)]" />
                  <span>
                    I agree that Couple of Dumpsters may store my message and contact details to reply to me, as
                    described in the{" "}
                    <Link to="/legal/$slug" params={{ slug: "privacy" }} className="font-semibold text-forest underline">
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.consent && <p className="mt-2 text-sm font-medium text-destructive">{errors.consent}</p>}
              </div>
              {errors.form && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {errors.form}
                </p>
              )}
              <Button type="submit" variant="forest" size="xl" disabled={busy}>
                {busy ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>
        <aside className="space-y-6 lg:col-span-4 lg:col-start-9">
          <div className="rounded-2xl bg-forest-deep p-8 text-cream">
            <p className="eyebrow text-gold">On YouTube</p>
            <p className="mt-3 text-lg">Leave a comment on any video. We read those too.</p>
            <Button asChild variant="gold" className="mt-6 rounded-full">
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
                <Youtube aria-hidden /> @CoupleofDumpsters
              </a>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-paper p-8">
            <p className="eyebrow text-clay">Need something?</p>
            <p className="mt-3 text-foreground/80">
              If you're looking for help with an item you need, see our Charity &amp; Community pages.
            </p>
            <Link to="/charity-community" className="mt-4 inline-block font-semibold text-forest underline">
              Charity &amp; Community
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
