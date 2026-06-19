import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getCampaignById } from "../data/mockData.js";
import { deleteCharacter } from "../services/charactersApi.js";
import OrnateCorners from "./OrnateCorners.jsx";
import CharacterPortrait from "./CharacterPortrait.jsx";

export default function CharacterCard({ character, onDeleted }) {
  const campaign = getCampaignById(character.campaignId);

  async function handleDelete() {
    const shouldDelete = window.confirm(`¿Eliminar a ${character.name}? Esta acción no se puede deshacer.`);

    if (!shouldDelete) {
      return;
    }

    await deleteCharacter(character.id);
    onDeleted?.(character.id);
  }

  return (
    <article className="fantasy-card p-8">
      <OrnateCorners />

      <CharacterPortrait
        character={character}
        frameClassName="mb-6 aspect-[4/3] w-full border border-primary/30"
      />

      <p className="font-label text-[10px] uppercase tracking-[0.25em] text-primary">
        {campaign?.name ?? "Campaña desconocida"}
      </p>

      <h2 className="mt-4 font-display text-3xl text-on-surface epic-title">{character.name}</h2>

      <div className="mt-6 flex flex-wrap gap-3">
        <span className="stat-pill">{character.className}</span>
        <span className="stat-pill">{character.race}</span>
        <span className="stat-pill">Nivel {character.level}</span>
      </div>

      <p className="mt-6 leading-7 text-on-surface-variant">{character.description}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to={`/players/${character.playerId}/characters/${character.id}`}
          className="gold-border-btn inline-flex items-center gap-2 px-6 py-3 font-display text-xs uppercase tracking-[0.2em] text-primary transition-all"
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Ver historia
        </Link>

        <Link
          to={`/editar-personaje/${character.id}`}
          className="gold-border-btn inline-flex items-center gap-2 px-6 py-3 font-display text-xs uppercase tracking-[0.2em] text-primary transition-all"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Editar
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          className="danger-border-btn inline-flex items-center gap-2 px-6 py-3 font-display text-xs uppercase tracking-[0.2em] transition-all"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Eliminar
        </button>
      </div>
    </article>
  );
}
