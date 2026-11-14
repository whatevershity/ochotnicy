import { connection } from "next/server";
import { AktualnosciTabs } from "@/components/AktualnosciTabs";
import { NewsPostCard } from "@/components/NewsPostCard";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllAktualnosci, isArtykulyKind } from "@/lib/aktualnosci";

/** Wersja pozioma (lista wierszy) zapisana w: `@/components/AktualnosciListPoziom` */

export const metadata = {
  title: "Aktualności — Stowarzyszenie Ochotnicy Wolności",
  description: "Najnowsze działania, upamiętnienia i wydarzenia stowarzyszenia.",
};

export const instant = false;

function ArchiveGrid({
  posts,
  emptyLabel,
}: {
  posts: Awaited<ReturnType<typeof getAllAktualnosci>>;
  emptyLabel: string;
}) {
  if (posts.length === 0) {
    return <p className="news__empty">{emptyLabel}</p>;
  }

  return (
    <ul className="news__grid news__grid--archive">
      {posts.map((post) => (
        <NewsPostCard
          key={post.slug}
          post={post}
          headingLevel="h2"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ))}
    </ul>
  );
}

export default async function AktualnosciPage() {
  await connection();
  const posts = (await getAllAktualnosci()).filter(
    (p) => p.slug !== "wpis-z-panelu",
  );
  const aktualnosci = posts.filter((p) => !isArtykulyKind(p.kind));
  const artykuly = posts.filter((p) => isArtykulyKind(p.kind));

  return (
    <main className="news-page">
      <div className="news-page__inner news-page__inner--list">
        <AktualnosciTabs
          panelAktualnosci={
            <ArchiveGrid posts={aktualnosci} emptyLabel="Brak aktualności." />
          }
          panelArtykuly={
            <ArchiveGrid posts={artykuly} emptyLabel="Brak artykułów." />
          }
        />
      </div>
      <SiteFooter />
    </main>
  );
}
