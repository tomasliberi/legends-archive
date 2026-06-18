import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import CharacterCard from "../components/CharacterCard.jsx";
import { getPlayerById } from "../data/mockData.js";
import { fetchCharacters } from "../services/charactersApi.js";

export default function PlayerDetailPage() {
  const { playerId } = useParams();
  const player = getPlayerById(playerId);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchCharacters().then((allCharacters) => {
      setCharacters(allCharacters.filter((character) => character.playerId === playerId));
    });
  }, [playerId]);

  if (!player) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/"
          className="gold-border-btn inline-flex items-center justify-center gap-2 px-8 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary transition-all"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a jugadores
        </Link>

        <Link
          to={`/cargar-personaje?player=${player.id}`}
          className="gold-border-btn inline-flex items-center justify-center gap-2 px-8 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary transition-all"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Cargar personaje
        </Link>
      </div>

      <section className="mb-12 mt-12">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
          Perfil del jugador
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.1em] text-on-surface epic-title md:text-7xl">
          {player.name}
        </h1>
        <p className="mt-3 font-label text-sm uppercase tracking-[0.25em] text-primary">
          {player.title}
        </p>
        <div className="mt-6 h-1 w-24 bg-primary" />
        <p className="mt-6 max-w-2xl text-lg italic text-on-surface-variant">
          {player.description}
        </p>
      </section>

      <section>
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-label text-xs uppercase tracking-[0.3em] text-primary">
              Personajes registrados
            </p>
            <h2 className="font-display text-3xl text-on-surface epic-title">Compañía de aventuras</h2>
          </div>
          <p className="font-label text-xs uppercase tracking-widest text-primary/70">
            {characters.length} perfiles activos
          </p>
        </div>

        {characters.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onDeleted={(characterId) =>
                  setCharacters((currentCharacters) =>
                    currentCharacters.filter((item) => item.id !== characterId),
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="fantasy-card p-8">
            <p className="max-w-2xl text-on-surface-variant">
              Todavía no hay personajes cargados para {player.name}. Podés crear el primero desde
              el botón de arriba.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
