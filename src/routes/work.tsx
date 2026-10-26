import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { PageHeader } from "../components/portfolio-shell";
import { projects } from "../lib/portfolio";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Lorenzo Gargiulo" },
      { name: "description", content: "Film e lavori diretti da Lorenzo Gargiulo." },
      { property: "og:title", content: "Work — Lorenzo Gargiulo" },
      { property: "og:description", content: "Film e lavori diretti da Lorenzo Gargiulo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkPage,
});
function WorkPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname.startsWith("/work/")) return <Outlet />;

  return (
    <main className="page-wrap">
      <PageHeader title="Work" />
      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link to="/work/$slug" params={{ slug: project.slug }}>
              <span>
                {project.title}
                {project.subtitle && <span className="project-subtitle">“{project.subtitle}”</span>}
              </span>
              <span>{project.year}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
