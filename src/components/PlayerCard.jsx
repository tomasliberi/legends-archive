import { Crown, Flame, Heart, Shield, Sparkles, Sword, Target } from "lucide-react";
import { Link } from "react-router-dom";
import OrnateCorners from "./OrnateCorners.jsx";

const icons = {
  Crown,
  Flame,
  Heart,
  Shield,
  Sparkles,
  Sword,
  Target,
};

export default function PlayerCard({ player, characterCount = 0 }) {
  const Icon = icons[player.icon] ?? Shield;

  return (
    <Link
      to={`/players/${player.id}`}
      className="fantasy-card group relative flex min-h-[390px] cursor-pointer flex-col justify-end overflow-hidden p-8"
    >
      <OrnateCorners />
      <div className={`absolute inset-0 bg-gradient-to-b ${player.accent} via-[#181818] to-black opacity-80`} />

      <div className="relative z-20">
        <Icon className="mb-8 h-14 w-14 text-primary" strokeWidth={1.4} aria-hidden="true" />
        <span className="border border-primary/50 bg-black/60 px-3 py-1 font-label text-[10px] uppercase text-primary">
          {player.pronoun}
        </span>
        <h3 className="mt-4 font-display text-3xl tracking-wider text-on-surface epic-title">
          {player.name}
        </h3>
        <p className="mt-2 font-label text-xs uppercase tracking-widest text-primary/80">{player.title}</p>
        <p className="mt-4 text-on-surface-variant">{characterCount} personajes cargados</p>
        <p className="mt-6 font-label text-xs uppercase tracking-widest text-primary opacity-0 transition-all group-hover:opacity-100">
          Ver personajes
        </p>
      </div>
    </Link>
  );
}
