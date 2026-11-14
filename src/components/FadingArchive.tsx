import Image from "next/image";

/** Static archival frames — no fade loop for now */
const SHOTS = [
  {
    src: "/brand/gallery/01.jpg",
    place: "fade-shot--a",
  },
  {
    src: "/brand/gallery/02.png",
    place: "fade-shot--b",
  },
] as const;

export function FadingArchive() {
  return (
    <div className="fade-archive pointer-events-none absolute inset-0" aria-hidden>
      {SHOTS.map((shot) => (
        <div key={shot.place} className={`fade-shot ${shot.place} is-on`}>
          <Image
            src={shot.src}
            alt=""
            fill
            sizes="(max-width: 768px) 85vw, 48vw"
            className="object-cover grayscale"
          />
        </div>
      ))}
    </div>
  );
}
