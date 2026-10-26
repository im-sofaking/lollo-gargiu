import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Lorenzo Gargiulo" },
      {
        name: "description",
        content: "Lorenzo Gargiulo is an Italian photographer and director based in Rome, Italy.",
      },
      { property: "og:title", content: "About — Lorenzo Gargiulo" },
      {
        property: "og:description",
        content: "Lorenzo Gargiulo is an Italian photographer and director based in Rome, Italy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});
function AboutPage() {
  return (
    <main className="page-wrap about-page">
      <div className="about-layout">
        <div className="about-portrait-placeholder" role="img" aria-label="Portrait placeholder">
          Portrait placeholder
        </div>
        <div className="about-copy">
          <p>
            Lorenzo Gargiulo is an Italian photographer and director based in Rome, Italy, working
            across reportage, fashion, lifestyle, and documentary photography.
          </p>
          <h2>Selected Clients &amp; Collaborations</h2>
          <p>
            Acqua di Parma · Airbnb · Bvlgari · Calvin Klein · Kodak · Leica Camera · Magma
            Production · Malfy Gin · Mercedes-Benz Italia · Weekend Max Mara
          </p>
          <h2>Contact</h2>
          <ul className="about-contact-list">
            <li>
              <a href="mailto:lorenzogargiulo8@gmail.com">lorenzogargiulo8@gmail.com</a>
            </li>
            <li>Instagram — link to be added</li>
            <li>Vimeo — link to be added</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
