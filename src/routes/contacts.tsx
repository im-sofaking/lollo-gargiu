import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/portfolio-shell";
export const Route = createFileRoute("/contacts")({ head: () => ({ meta: [
  { title: "Contacts — Lorenzo Gargiulo" }, { name: "description", content: "Contatti professionali di Lorenzo Gargiulo." },
  { property: "og:title", content: "Contacts — Lorenzo Gargiulo" }, { property: "og:description", content: "Contatti professionali di Lorenzo Gargiulo." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
]}), component: ContactsPage });
function ContactsPage() { return <main className="page-wrap"><PageHeader title="Contacts" /><div className="copy-column"><ul className="contact-list"><li>Email — <span>[da inserire]</span></li><li>Instagram — <span>[da inserire]</span></li><li>Vimeo — <span>[da inserire]</span></li><li>Representation — <span>[da inserire]</span></li></ul></div></main>; }