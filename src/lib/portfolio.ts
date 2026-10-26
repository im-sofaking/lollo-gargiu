export type PortfolioImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  shape: "landscape" | "portrait" | "medium" | "wide";
};

function sortAssetFiles(files: Record<string, string>) {
  return Object.entries(files).sort(([first], [second]) =>
    first.localeCompare(second, undefined, { numeric: true }),
  );
}

const slideshowFiles = sortAssetFiles(
  import.meta.glob<string>("../assets/SLIDESHOW/*.jpg", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);
const darkroomFiles = sortAssetFiles(
  import.meta.glob<string>("../assets/DARKROOM/*.jpg", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);
const mosaicMp4Files = sortAssetFiles(
  import.meta.glob<string>("../assets/MOSAIC/*.mp4", {
    eager: true,
    query: "?url",
    import: "default",
  }),
);
const mosaicWebmByMp4Path = new Map(
  sortAssetFiles(
    import.meta.glob<string>("../assets/MOSAIC/*.webm", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ).map(([path, src]) => [path.replace(/\.webm$/i, ".mp4"), src] as const),
);
const mosaicPosterByMp4Path = new Map(
  sortAssetFiles(
    import.meta.glob<string>("../assets/MOSAIC/*.jpg", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ).map(([path, src]) => [path.replace(/\.jpg$/i, ".mp4"), src] as const),
);

function describePhoto(path: string) {
  const filename =
    path
      .split("/")
      .at(-1)
      ?.replace(/\.jpg$/i, "") ?? "Fotografia";
  if (filename.includes("NYC")) return `New York, 2025 — ${filename.slice(-7)}`;
  if (filename.includes("Sicilia")) return "Sicilia, 2026";
  if (filename.includes("Ladakh")) return `Ladakh — ${filename}`;
  return `Fotografia ${filename}`;
}

function toPortfolioImage(path: string, src: string, alt: string): PortfolioImage {
  return {
    src,
    alt,
    width: 3,
    height: 2,
    shape: "landscape",
  };
}

export const homeImages: PortfolioImage[] = slideshowFiles.map(([path, src]) =>
  toPortfolioImage(path, src, describePhoto(path)),
);

export const darkroomImages: Array<PortfolioImage & { caption: string }> = darkroomFiles.map(
  ([path, src]) => {
    const alt = describePhoto(path);
    return { ...toPortfolioImage(path, src, alt), caption: alt };
  },
);

export const mosaicVideos = mosaicMp4Files.map(([path, src]) => ({
  src,
  webmSrc: mosaicWebmByMp4Path.get(path),
  poster: mosaicPosterByMp4Path.get(path) ?? "",
  alt: `Progetto video ${
    path
      .split("/")
      .at(-1)
      ?.replace(/\.mp4$/i, "")
      .replace(/_/g, " ") ?? "GIF"
  }`,
}));

export type PortfolioProject = { slug: string; title: string; subtitle?: string; year: string };

export const projects: PortfolioProject[] = [
  { slug: "calvin-klein", title: "Calvin Klein", year: "Film" },
  {
    slug: "acqua-di-parma-la-caletta",
    title: "Acqua di Parma",
    subtitle: "La Caletta by Vicky",
    year: "Film",
  },
  { slug: "bvlgari-riva-solare", title: "BVLGARI", subtitle: "Riva Solare", year: "Film" },
  { slug: "raspini-gioielli", title: "Raspini Gioielli", year: "Film" },
  { slug: "venchi", title: "Venchi", year: "Film" },
  {
    slug: "bvlgari-mfw-launch-teaser",
    title: "BVLGARI",
    subtitle: "MFW Launch Teaser",
    year: "Film",
  },
  {
    slug: "bvlgari-hotel-rome-opening",
    title: "BVLGARI",
    subtitle: "Hotel Rome Opening",
    year: "Film",
  },
];

export type ProjectSlug = (typeof projects)[number]["slug"];
