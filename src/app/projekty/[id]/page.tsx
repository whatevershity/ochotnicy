import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { PROJEKTY } from "@/lib/projekty";
import { getProjektAsync } from "@/lib/projekty-db";
import { renderInlineMarkdown } from "@/lib/simple-markdown";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return PROJEKTY.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const project = await getProjektAsync(id);
  if (!project) return { title: "Projekt" };
  return {
    title: `${project.title} — Ochotnicy Wolności`,
    description: project.teaser,
  };
}

export default async function ProjektPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjektAsync(id);
  if (!project) notFound();

  const [lead, ...rest] = project.body;

  return (
    <main className="projekt-page">
      <article className="projekt-page__inner">
        <p className="projekt-page__label">Projekt</p>
        <h1 className="projekt-page__title">{project.title}</h1>
        <p className="projekt-page__teaser">{project.teaser}</p>

        {project.image ? (
          <figure className="projekt-page__media">
            <Image
              src={project.image}
              alt={project.imageAlt}
              width={1400}
              height={900}
              className={
                project.imageFit === "contain"
                  ? "projekt-page__img projekt-page__img--contain"
                  : "projekt-page__img"
              }
              sizes="(max-width: 900px) 100vw, 880px"
              priority
              unoptimized
            />
          </figure>
        ) : null}

        {lead ? (
          <p className="projekt-page__lead">{renderInlineMarkdown(lead)}</p>
        ) : null}

        {rest.length ? (
          <div className="projekt-page__body">
            {rest.map((p) => (
              <p key={p.slice(0, 48)}>{renderInlineMarkdown(p)}</p>
            ))}
          </div>
        ) : null}

        {project.cta ? (
          <p className="projekt-page__cta">
            <a
              className="news__more-inline"
              href={project.cta.href}
              {...(project.cta.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {project.cta.label}
            </a>
          </p>
        ) : null}

        <p className="post__back">
          <Link className="post__back-link" href="/projekty">
            Wróć do projektów
          </Link>
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
