import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-primary/20 bg-surface-dark">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between px-6 py-12 md:flex-row md:px-16">
        <div className="mb-8 text-center md:mb-0 md:text-left">
          <div className="mb-2 font-display text-3xl text-primary epic-title">LEGENDS ARCHIVE</div>
          <p className="font-label text-xs tracking-wider text-on-surface-variant/60">
            Archivo privado de campañas, héroes y leyendas.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          <a className="footer-link" href="/#archivo">
            Campañas
          </a>
          <Link className="footer-link" to="/">
            Personajes
          </Link>
          <a className="footer-link" href="/#estadisticas">
            Sesiones
          </a>
        </div>
      </div>
    </footer>
  );
}
