import { useEffect, useRef, useState } from "react";

type SlideshowImage = { src: string };

export function usePreloadedSlideshow<T extends SlideshowImage>(images: readonly T[]) {
  const [active, setActive] = useState(0);
  const [loadedSources, setLoadedSources] = useState<ReadonlySet<string>>(() => new Set());
  const loadedSourcesRef = useRef(new Set<string>());
  const preloadCacheRef = useRef(new Map<string, HTMLImageElement>());
  const image = images[active];
  const isActiveImageLoaded = image ? loadedSources.has(image.src) : false;

  useEffect(() => {
    if (images.length === 0) return;

    const indexes = new Set([active, (active + 1) % images.length]);
    for (const index of indexes) {
      const image = images[index];
      if (!image || preloadCacheRef.current.has(image.src)) continue;

      const preloadedImage = new window.Image();
      preloadCacheRef.current.set(image.src, preloadedImage);
      preloadedImage.onload = () => {
        loadedSourcesRef.current.add(image.src);
        setLoadedSources(new Set(loadedSourcesRef.current));
      };
      preloadedImage.src = image.src;

      if (preloadedImage.complete && preloadedImage.naturalWidth > 0) {
        loadedSourcesRef.current.add(image.src);
        setLoadedSources(new Set(loadedSourcesRef.current));
      }
    }
  }, [active, images]);

  useEffect(() => {
    if (images.length < 2 || !isActiveImageLoaded) return;

    const timer = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % images.length;
        const nextImage = images[next];
        return nextImage && loadedSourcesRef.current.has(nextImage.src) ? next : current;
      });
    }, 4000);

    return () => window.clearInterval(timer);
  }, [active, images, isActiveImageLoaded]);

  return {
    active,
    setActive,
    isActiveImageLoaded,
  };
}
