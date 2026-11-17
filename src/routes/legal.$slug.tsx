import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/sections";
import { legalContent } from "@/lib/legal-content";
import { legalPages } from "@/lib/site";

export const Route = createFileRoute("/legal/$slug")({
  loader: ({ params }) => {
    const page = legalContent[params.slug];
    if (!page) throw notFound();
    return { title: page.title, summary: page.summary };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Page unavailable — Couple of Dumpsters" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.title} — Couple of Dumpsters` },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: `${loaderData.title} — Couple of Dumpsters` },
        { property: "og:description", content: loaderData.summary },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: LegalPageView,
});

function LegalPageView() {
  const { slug } = Route.useParams();
  const page = legalContent[slug];
  if (!page) return null;
  return (
    <>
      <PageHeader eyebrow="Policies" title={page.title} intro={page.summary} />
      <section className="container-page grid gap-12 py-16 lg:grid-cols-12">
        <nav aria-label="Policies" className="lg:col-span-3">
          <ul className="space-y-1">
            {legalPages.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/legal/$slug"
                  params={{ slug: p.slug }}
                  className="block rounded-md px-3 py-2 text-sm text-foreground/75 hover:bg-muted data-[status=active]:bg-secondary data-[status=active]:font-semibold data-[status=active]:text-forest"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-2xl lg:col-span-8 lg:col-start-5">
          <p className="rounded-xl border border-gold/60 bg-accent px-5 py-4 text-sm text-accent-foreground">
            <strong>Draft.</strong> This page is placeholder wording and has not yet been reviewed. It will be updated
            before the related services launch.
          </p>
          {page.sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="text-2xl">{s.heading}</h2>
              <p className="mt-3 text-lg text-foreground/80">{s.body}</p>
            </section>
          ))}
        </article>
      </section>
    </>
  );
}
