import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/lib/forms.functions";
import { newsletterSchema } from "@/lib/form-schemas";
import { cn } from "@/lib/utils";

export function NewsletterForm({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const submit = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dark = tone === "dark";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const company = (new FormData(e.currentTarget).get("company") as string) ?? "";
    const parsed = newsletterSchema.safeParse({ email, consent, company });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await submit({ data: parsed.data });
      setDone(true);
      toast.success("You're on the list. Thank you!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className={cn("font-display text-xl", dark ? "text-cream" : "text-forest", className)} role="status">
        Thanks for signing up. We'll be in touch with our latest finds.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`nl-email-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-email-${tone}`}
          type="email"
          autoComplete="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "h-12 flex-1 rounded-full border px-5 text-[0.95rem] outline-none transition-colors focus-visible:ring-2",
            dark
              ? "border-cream/25 bg-cream/10 text-cream placeholder:text-cream/55 focus-visible:ring-gold"
              : "border-input bg-paper text-foreground placeholder:text-muted-foreground focus-visible:ring-ring",
          )}
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <Button type="submit" variant={dark ? "gold" : "forest"} size="xl" disabled={busy}>
          {busy ? "Signing up…" : "Subscribe"}
        </Button>
      </div>
      <label className={cn("mt-3 flex items-start gap-2.5 text-sm", dark ? "text-cream/75" : "text-muted-foreground")}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 accent-[var(--gold)]"
        />
        <span>I'd like to receive occasional emails about new videos and finds. Unsubscribe any time.</span>
      </label>
      {error && (
        <p role="alert" className={cn("mt-2 text-sm font-medium", dark ? "text-gold" : "text-destructive")}>
          {error}
        </p>
      )}
    </form>
  );
}
