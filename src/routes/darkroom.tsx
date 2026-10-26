import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlideshowDots } from "../components/portfolio-shell";
import { usePreloadedSlideshow } from "../hooks/use-preloaded-slideshow";
import { darkroomImages } from "../lib/portfolio";

export const Route = createFileRoute("/darkroom")({
  head: () => ({
    meta: [
      { title: "Darkroom — Lorenzo Gargiulo" },
      {
        name: "description",
        content: "Stampe analogiche dalla camera oscura di Lorenzo Gargiulo.",
      },
      { property: "og:title", content: "Darkroom — Lorenzo Gargiulo" },
      {
        property: "og:description",
        content: "Stampe analogiche dalla camera oscura di Lorenzo Gargiulo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DarkroomPage,
});

function DarkroomPage() {
  const { active, setActive, isActiveImageLoaded } = usePreloadedSlideshow(darkroomImages);

  const showPrevious = () =>
    setActive((current) => (current - 1 + darkroomImages.length) % darkroomImages.length);
  const showNext = () => setActive((current) => (current + 1) % darkroomImages.length);
  const image = darkroomImages[active] ?? darkroomImages[0];
  if (!image) return null;
  return (
    <main className="home-page">
      <section className="home-slideshow" aria-live="off">
        <div className="home-stage">
          <figure className={`home-photo-frame home-photo-frame-${image.shape}`}>
            {isActiveImageLoaded && (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="home-image"
              />
            )}
            <button
              type="button"
              className="slideshow-arrow slideshow-arrow-previous"
              onClick={showPrevious}
              aria-label="Foto precedente"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="slideshow-arrow slideshow-arrow-next"
              onClick={showNext}
              aria-label="Foto successiva"
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <figcaption className="home-image-caption">{image.caption}</figcaption>
          </figure>
        </div>
        <SlideshowDots active={active} total={darkroomImages.length} />
      </section>
    </main>
  );
}
