import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SlideshowDots } from "../components/portfolio-shell";
import { homeImages, mosaicVideos } from "../lib/portfolio";
import { usePreloadedSlideshow } from "../hooks/use-preloaded-slideshow";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lorenzo Gargiulo — Photographer & Filmmaker" },
      { name: "description", content: "Fotografia analogica e film di Lorenzo Gargiulo." },
      { property: "og:title", content: "Lorenzo Gargiulo — Photographer & Filmmaker" },
      { property: "og:description", content: "Fotografia analogica e film di Lorenzo Gargiulo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function shuffledImages() {
  const next = [...homeImages];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    const currentImage = next[index];
    const targetImage = next[target];
    if (currentImage && targetImage) {
      next[index] = targetImage;
      next[target] = currentImage;
    }
  }
  return next;
}

function MosaicTile({ item, index }: { item: (typeof mosaicVideos)[number]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoadVideo(true);
      setIsInViewport(true);
      return;
    }

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadVideo(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: "0px" },
    );
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      setIsInViewport(entry?.isIntersecting ?? false);
    });

    loadObserver.observe(video);
    visibilityObserver.observe(video);
    return () => {
      loadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && shouldLoadVideo) video.load();
  }, [shouldLoadVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo || !isInViewport) {
      video?.pause();
      return;
    }

    void video.play().catch(() => undefined);
    return () => video.pause();
  }, [isInViewport, shouldLoadVideo]);

  return (
    <div className={`mosaic-tile mosaic-tile-${index + 1}`}>
      <video
        ref={videoRef}
        aria-label={item.alt}
        autoPlay
        loop
        muted
        playsInline
        poster={item.poster}
        preload="none"
      >
        {shouldLoadVideo && (
          <>
            <source src={item.webmSrc} type="video/webm" />
            <source src={item.src} type="video/mp4" />
          </>
        )}
      </video>
    </div>
  );
}

function Index() {
  const [order, setOrder] = useState(() => [...homeImages]);
  const { active, setActive, isActiveImageLoaded } = usePreloadedSlideshow(order);

  useEffect(() => {
    setOrder(shuffledImages());
    setActive(0);
  }, [setActive]);

  const showPrevious = () => setActive((current) => (current - 1 + order.length) % order.length);
  const showNext = () => setActive((current) => (current + 1) % order.length);
  const image = order[active] ?? homeImages[0];
  if (!image) return null;
  return (
    <main className="home-page">
      <section className="home-slideshow home-slideshow-home" aria-live="off">
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
            <figcaption className="home-image-caption">{image.alt}</figcaption>
          </figure>
        </div>
        <SlideshowDots active={active} total={order.length} />
      </section>
      <section className="home-mosaic" aria-label="Galleria fotografica">
        {mosaicVideos.map((item, index) => (
          <MosaicTile item={item} index={index} key={item.src} />
        ))}
      </section>
    </main>
  );
}
