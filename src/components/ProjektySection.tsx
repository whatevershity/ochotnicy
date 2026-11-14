"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HOME_PROJEKTY,
  PROJEKTY,
  PROJEKTY_DEFAULT_ID,
  type Projekt,
} from "@/lib/projekty";
import { renderInlineMarkdown } from "@/lib/simple-markdown";

function ProjectMedia({
  project,
  sizes,
  priority = false,
  className,
}: {
  project: Projekt;
  sizes: string;
  priority?: boolean;
  className: string;
}) {
  if (!project.image) {
    return (
      <span
        className={`${className} projekty__media-empty`}
        aria-label={project.imageAlt}
        role="img"
      />
    );
  }

  const fitClass =
    project.imageFit === "contain" ? " projekty__img--contain" : "";

  return (
    <Image
      src={project.image}
      alt={project.imageAlt}
      fill
      className={`${className}${fitClass}`}
      sizes={sizes}
      priority={priority}
      unoptimized
    />
  );
}

function FeaturePanel({ project }: { project: Projekt }) {
  const [lead, ...rest] = project.body;

  return (
    <div className="projekty__feature" key={project.id}>
      <div className="projekty__feature-media">
        <ProjectMedia
          project={project}
          className="projekty__feature-img"
          sizes="(max-width: 900px) 94vw, 58vw"
          priority
        />
      </div>

      <div className="projekty__feature-copy">
        <p className="projekty__feature-label">Projekt</p>
        <h3 className="projekty__feature-title">{project.title}</h3>
        {lead ? (
          <p className="projekty__feature-lead">
            {renderInlineMarkdown(lead)}
          </p>
        ) : null}
        {rest.length ? (
          <div className="projekty__feature-body">
            {rest.map((p) => (
              <p key={p.slice(0, 48)}>{renderInlineMarkdown(p)}</p>
            ))}
          </div>
        ) : null}
        {project.cta ? (
          <p className="projekty__feature-cta">
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
      </div>
    </div>
  );
}

function ThumbCard({
  project,
  active,
  onSelect,
}: {
  project: Projekt;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`projekty__thumb${active ? " is-active" : ""}`}
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`Pokaż projekt: ${project.title}`}
    >
      <span className="projekty__thumb-media">
        <ProjectMedia
          project={project}
          className="projekty__thumb-img"
          sizes="(max-width: 900px) 44vw, 22vw"
        />
      </span>
      <span className="projekty__thumb-title">{project.title}</span>
      <span className="projekty__thumb-teaser">{project.teaser}</span>
    </button>
  );
}

/**
 * Desktop: stage + thumbs.
 * Mobile: jasne pigułki jak Cool Cat (tytuł + teaser) → podstrona.
 */
export function ProjektySection() {
  const [activeId, setActiveId] = useState<string>(PROJEKTY_DEFAULT_ID);
  const [fade, setFade] = useState(true);

  const active = PROJEKTY.find((p) => p.id === activeId) ?? PROJEKTY[0];

  function selectProject(id: string) {
    if (id === activeId) return;
    setFade(false);
    window.setTimeout(() => {
      setActiveId(id);
      setFade(true);
    }, 140);
  }

  useEffect(() => {
    setFade(true);
  }, []);

  return (
    <section id="projekty" aria-labelledby="projekty-heading" className="projekty">
      <div className="projekty__inner">
        <header className="home-head home-head--on-dark projekty__head--desktop">
          <div className="home-head__bar">
            <h2 id="projekty-heading" className="home-head__title">
              Nasze projekty
            </h2>
          </div>
        </header>

        <div className="projekty__stage">
          <div
            className={`projekty__feature-wrap${fade ? " is-in" : " is-out"}`}
          >
            <FeaturePanel project={active} />
          </div>

          <aside className="projekty__side">
            <div className="projekty__thumbs">
              {PROJEKTY.map((project) => (
                <ThumbCard
                  key={project.id}
                  project={project}
                  active={project.id === active.id}
                  onSelect={() => selectProject(project.id)}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile: jak Aktualności / Artykuły — wiersze z miniaturą */}
      <div className="projekty-m">
        <header className="home-head">
          <div className="home-head__bar">
            <h2 className="home-head__title">Nasze projekty</h2>
          </div>
        </header>
        <ul className="projekty-m__rows" aria-label="Lista projektów">
          {HOME_PROJEKTY.map((project) => (
            <li key={project.id} className="projekty-m__row">
              <Link
                href={`/projekty/${project.id}`}
                className="projekty-m__row-link"
              >
                <span className="projekty-m__row-thumb" aria-hidden>
                  <ProjectMedia
                    project={project}
                    className="projekty-m__row-img"
                    sizes="9rem"
                  />
                </span>
                <span className="projekty-m__row-copy">
                  <span className="projekty-m__row-title">{project.title}</span>
                  <span className="projekty-m__row-teaser">{project.teaser}</span>
                  <span className="projekty-m__row-arrow" aria-hidden>
                    <span className="projekty-m__row-arrow-label">⟶</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="projekty-m__more">
          <Link href="/projekty" className="ow-btn ow-btn--sweep">
            <span className="ow-btn__label">ZOBACZ WIĘCEJ</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
