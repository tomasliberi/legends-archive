import { ArrowLeft, Pencil, Plus, ScrollText, Shield, Swords, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import OrnateCorners from "../components/OrnateCorners.jsx";
import { getCampaignById, getPlayerById, getSessionsByCampaign } from "../data/mockData.js";
import { deleteCharacter, fetchCharacters } from "../services/charactersApi.js";

export default function CharacterDetailPage() {
  const { playerId, characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCharacters().then((characters) => {
      setCharacter(characters.find((item) => item.id === characterId) ?? null);
      setIsLoading(false);
    });
  }, [characterId]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
          Cargando personaje...
        </p>
      </main>
    );
  }

  if (!character || character.playerId !== playerId) {
    return <Navigate to="/" replace />;
  }

  const player = getPlayerById(character.playerId);
  const campaign = getCampaignById(character.campaignId);
  const sessions = getSessionsByCampaign(character.campaignId);

  async function handleDelete() {
    const shouldDelete = window.confirm(`¿Eliminar a ${character.name}? Esta acción no se puede deshacer.`);

    if (!shouldDelete) {
      return;
    }

    await deleteCharacter(character.id);
    navigate(`/players/${player.id}`);
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={`/players/${player.id}`}
          className="gold-border-btn inline-flex items-center justify-center gap-2 px-8 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary transition-all"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al perfil
        </Link>

        <Link
          to={`/cargar-personaje?player=${player.id}`}
          className="gold-border-btn inline-flex items-center justify-center gap-2 px-8 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary transition-all"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Cargar otro
        </Link>

        <Link
          to={`/editar-personaje/${character.id}`}
          className="gold-border-btn inline-flex items-center justify-center gap-2 px-8 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary transition-all"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Editar
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          className="danger-border-btn inline-flex items-center justify-center gap-2 px-8 py-3 font-display text-sm uppercase tracking-[0.2em] transition-all"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Eliminar
        </button>
      </div>

      <section className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="fantasy-card p-8 md:p-10">
          <OrnateCorners />
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
            {player.name} interpreta
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-on-surface epic-title md:text-7xl">
            {character.name}
          </h1>
          <div className="mt-6 h-1 w-24 bg-primary" />

          {character.photo ? (
            <img
              src={character.photo}
              alt={character.name}
              className="mt-8 aspect-[16/9] w-full border border-primary/30 object-cover"
            />
          ) : null}

          <p className="mt-8 text-xl italic leading-9 text-on-surface-variant">
            {character.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="stat-pill">{character.className}</span>
            <span className="stat-pill">{character.race}</span>
            <span className="stat-pill">Nivel {character.level}</span>
            <span className="stat-pill">{character.status}</span>
          </div>

          <div className="mt-10">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <ScrollText className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-display text-2xl epic-title">Historia</h2>
            </div>
            <p className="leading-8 text-on-surface-variant">{character.backstory}</p>
          </div>
        </article>

        <aside className="space-y-6">
          <section className="fantasy-card p-7">
            <OrnateCorners />
            <div className="mb-4 flex items-center gap-3 text-primary">
              <Shield className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-display text-2xl epic-title">Ficha rápida</h2>
            </div>
            <dl className="space-y-4 text-sm">
              <div className="detail-row">
                <dt>Campaña</dt>
                <dd>{campaign?.name}</dd>
              </div>
              <div className="detail-row">
                <dt>Alineamiento</dt>
                <dd>{character.alignment}</dd>
              </div>
              <div className="detail-row">
                <dt>Jugador</dt>
                <dd>{player.name}</dd>
              </div>
            </dl>
          </section>

          <section className="fantasy-card p-7">
            <OrnateCorners />
            <div className="mb-4 flex items-center gap-3 text-primary">
              <Swords className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-display text-2xl epic-title">Rasgos</h2>
            </div>
            {character.traits.length > 0 ? (
              <ul className="space-y-3">
                {character.traits.map((trait) => (
                  <li
                    className="border-l border-primary/50 pl-4 text-on-surface-variant"
                    key={trait}
                  >
                    {trait}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-on-surface-variant">Sin rasgos cargados todavía.</p>
            )}
          </section>

          <section className="fantasy-card p-7">
            <OrnateCorners />
            <p className="mb-4 font-label text-[10px] uppercase tracking-[0.25em] text-primary">
              Sesiones vinculadas
            </p>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  className="flex items-center justify-between gap-4 border-b border-outline/50 pb-3 last:border-b-0 last:pb-0"
                  key={session.id}
                >
                  <span className="text-on-surface-variant">{session.title}</span>
                  <span className="font-label text-xs uppercase tracking-widest text-primary">
                    #{session.number}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
