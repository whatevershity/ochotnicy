import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllProjekty } from "@/lib/projekty-db";
import { renderInlineMarkdown } from "@/lib/simple-markdown";

export const metadata = {
  title: "Nasze projekty — Stowarzyszenie Ochotnicy Wolności",
  description:
    "Mural, dziennik, obchody, kwerendy, koszulki, archiwum — projekty Stowarzyszenia Ochotnicy Wolności.",
};

export default async function ProjektyIndexPage() {
  const projects = await getAllProjekty();

  return (
    <main className="projekty-index">
      <div className="projekty-index__inner">
        <header className="home-head">
          <div className="home-head__bar">
            <h1 className="home-head__title">Nasze projekty</h1>
          </div>
        </header>

        <div className="projekty-index__list">
          {projects.map((project) => {
            const [lead, ...rest] = project.body;
            return (
              <article
                key={project.id}
                id={project.id}
                className="projekty-index__item"
              >
                <h2 className="projekty-index__item-title">{project.title}</h2>
                <p className="projekty-index__item-teaser">{project.teaser}</p>

                {project.image ? (
                  <figure className="projekty-index__item-media">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      width={1400}
                      height={900}
                      className={
                        project.imageFit === "contain"
                          ? "projekty-index__item-img projekty-index__item-img--contain"
                          : "projekty-index__item-img"
                      }
                      sizes="(max-width: 900px) 100vw, 720px"
                      unoptimized
                    />
                  </figure>
                ) : null}

                {lead ? (
                  <p className="projekty-index__item-lead">
                    {renderInlineMarkdown(lead)}
                  </p>
                ) : null}

                {rest.length ? (
                  <div className="projekty-index__item-body">
                    {rest.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>
                        {renderInlineMarkdown(paragraph)}
                      </p>
                    ))}
                  </div>
                ) : null}

                {project.cta ? (
                  <p className="projekty-index__item-cta">
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
              </article>
            );
          })}
        </div>

        <p className="post__back">
          <Link className="post__back-link" href="/#projekty">
            Wróć na stronę główną
          </Link>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
