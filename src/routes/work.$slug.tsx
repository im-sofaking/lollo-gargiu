import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader } from "../components/portfolio-shell";
import { projects } from "../lib/portfolio";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = projects.find((item) => item.slug === params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.title}${loaderData.subtitle ? ` — ${loaderData.subtitle}` : ""}`
      : "Work";
    return {
      meta: [
        { title: `${title} — Lorenzo Gargiulo` },
        { name: "description", content: `${title}, film di Lorenzo Gargiulo.` },
        { property: "og:title", content: `${title} — Lorenzo Gargiulo` },
        { property: "og:description", content: `${title}, film di Lorenzo Gargiulo.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProjectPage,
});
function ProjectPage() {
  const project = Route.useLoaderData();
  const title = `${project.title}${project.subtitle ? ` — ${project.subtitle}` : ""}`;

  return (
    <main className="page-wrap project-page">
      <PageHeader title={title} />
      <h1 className="project-title">{title}</h1>
      <div className="media-placeholder project-video-placeholder">
        <span>Project film placeholder</span>
      </div>
      <section className="project-description">
        <p className="project-kicker">
          {project.year} · {project.title}
        </p>
        <p>
          Project description placeholder. A short introduction to the creative direction,
          production, and story behind this work will appear here.
        </p>
      </section>
      <section className="project-gallery" aria-label={`${title} image gallery placeholders`}>
        {[1, 2, 3].map((imageNumber) => (
          <div
            className={`project-image-placeholder project-image-placeholder-${imageNumber}`}
            key={imageNumber}
            role="img"
            aria-label={`Project image ${imageNumber} placeholder`}
          >
            <span>Image {String(imageNumber).padStart(2, "0")} placeholder</span>
          </div>
        ))}
      </section>
    </main>
  );
}
