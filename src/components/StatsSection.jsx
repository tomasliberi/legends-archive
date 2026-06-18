import { campaigns, sessions } from "../data/mockData.js";
import OrnateCorners from "./OrnateCorners.jsx";

export default function StatsSection({ characterCount = 0 }) {
  const stats = [
    { label: "Campañas", value: campaigns.length },
    { label: "Personajes", value: characterCount },
    { label: "Sesiones", value: sessions.length },
    { label: "Jugadores", value: 5 },
  ];

  return (
    <section id="estadisticas" className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <div className="fantasy-card p-8" key={stat.label}>
          <OrnateCorners />
          <p className="font-label text-xs uppercase tracking-widest text-primary">{stat.label}</p>
          <p className="mt-4 font-display text-5xl">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
