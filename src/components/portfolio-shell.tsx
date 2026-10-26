import { Link, useRouterState } from "@tanstack/react-router";
import { Instagram, Menu, Play, Search, X } from "lucide-react";
import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

export function IconButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`icon-button ${className}`} />;
}

export function SlideshowDots({ active, total }: { active: number; total: number }) {
  const activeDot = Math.round((active / Math.max(total - 1, 1)) * 4);

  return (
    <div className="slideshow-dots" role="img" aria-label={`Immagine ${active + 1} di ${total}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={index === activeDot ? "slideshow-dot slideshow-dot-active" : "slideshow-dot"}
        />
      ))}
    </div>
  );
}

export function PortfolioShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mosaicVisible, setMosaicVisible] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const updateMosaicVisibility = () => {
      const mosaic = pathname === "/" ? document.querySelector(".home-mosaic") : null;
      if (!mosaic) {
        setMosaicVisible(false);
        return;
      }

      const bounds = mosaic.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      setMosaicVisible(bounds.top <= viewportCenter && bounds.bottom > viewportCenter);
    };

    updateMosaicVisibility();
    const frame = window.requestAnimationFrame(updateMosaicVisibility);
    window.addEventListener("scroll", updateMosaicVisibility, { passive: true });
    window.addEventListener("resize", updateMosaicVisibility);
    window.addEventListener("popstate", updateMosaicVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateMosaicVisibility);
      window.removeEventListener("resize", updateMosaicVisibility);
      window.removeEventListener("popstate", updateMosaicVisibility);
    };
  }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <div className={`site-shell ${mosaicVisible ? "site-shell-mosaic" : ""}`}>
      <header className="site-header">
        <Link to="/" className="site-name" aria-label="Torna alla pagina iniziale">
          Lorenzo Gargiulo
        </Link>
        <div className="header-actions">
          <IconButton
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </IconButton>
          {pathname === "/" && (
            <IconButton type="button" aria-label="Cerca" title="Cerca">
              <Search aria-hidden="true" />
            </IconButton>
          )}
        </div>
      </header>
      <nav
        id="site-menu"
        className={`menu-panel ${open ? "menu-panel-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu-links">
          <Link to="/darkroom" onClick={closeMenu}>
            Darkroom
          </Link>
          <Link to="/work" onClick={closeMenu}>
            Work
          </Link>
          <Link to="/about" onClick={closeMenu}>
            About
          </Link>
        </div>
        <div className="menu-socials" aria-label="Social media">
          <a href="#" aria-label="Instagram — link da inserire" title="Instagram">
            <Instagram aria-hidden="true" />
          </a>
          <a href="#" aria-label="Vimeo — link da inserire" title="Vimeo">
            <Play aria-hidden="true" />
          </a>
        </div>
      </nav>
      <div
        className={`menu-backdrop ${open ? "menu-backdrop-open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div className="site-content">{children}</div>
    </div>
  );
}

export function PageHeader({ title }: { title: string }) {
  return (
    <h1 className="page-heading">
      <span>{title}</span>
    </h1>
  );
}
