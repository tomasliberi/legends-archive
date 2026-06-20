import { Archive, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    [
      "font-display text-sm md:text-lg tracking-widest transition-colors",
      isActive
        ? "border-b border-primary pb-1 text-primary"
        : "text-on-surface-variant hover:text-primary",
    ].join(" ");

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/20 bg-surface-dark/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4 md:px-16">
        <NavLink
          to="/"
          className="font-display text-2xl font-bold tracking-widest text-primary epic-title md:text-3xl"
          aria-label="Ir al inicio"
        >
          LEGENDS ARCHIVE
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass}>
            Jugadores
          </NavLink>
          <NavLink to="/campanas" className={linkClass}>
            Campañas
          </NavLink>
          <a
            className="font-display text-lg tracking-widest text-on-surface-variant transition-colors hover:text-primary"
            href="/#estadisticas"
          >
            Estadísticas
          </a>
          <a
            className="font-display text-lg tracking-widest text-on-surface-variant transition-colors hover:text-primary"
            href="/#archivo"
          >
            Archivo
          </a>
          <NavLink to="/cargar-personaje" className={linkClass}>
            Cargar
          </NavLink>
        </div>

        <div className="flex items-center gap-3 text-primary">
          <NavLink to="/campanas" className="font-display text-xs uppercase tracking-widest md:hidden">
            Campañas
          </NavLink>
          <Archive className="hidden h-5 w-5 md:block" aria-hidden="true" />
          <Shield className="h-7 w-7" aria-hidden="true" />
        </div>
      </div>
    </nav>
  );
}
