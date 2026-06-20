import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PlayerCard from "../components/PlayerCard.jsx";
import StatsSection from "../components/StatsSection.jsx";
import { campaigns, players } from "../data/mockData.js";
import { fetchCharacters } from "../services/charactersApi.js";

export default function HomePage() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchCharacters().then(setCharacters);
  }, []);

  function countCharactersByPlayer(playerId) {
    return characters.filter((character) => character.playerId === playerId).length;
  }

  return (
    <main>
      <header className="relative mx-auto flex min-h-[430px] w-full max-w-[1440px] flex-col justify-end overflow-hidden border-b border-primary/10 px-6 pb-16 md:px-16">
        <div className="black-paper absolute inset-0 z-0 opacity-20" />

        <div className="relative z-10 space-y-4">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
            Archivo privado de campañas
          </p>
          <h1 className="font-display text-5xl uppercase tracking-[0.1em] text-on-surface epic-title md:text-7xl">
            Crónicas de <span className="text-primary">Rol</span>
          </h1>
          <div className="mb-6 h-1 w-24 bg-primary" />
          <p className="max-w-2xl text-lg italic text-on-surface-variant">
            Un registro para guardar jugadores, personajes, campañas, sesiones memorables,
            muertes heroicas, objetos legendarios y toda la historia de sus partidas.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-16">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-label text-xs uppercase tracking-[0.3em] text-primary">
              Seleccioná un jugador
            </p>
            <h2 className="font-display text-3xl text-on-surface epic-title md:text-4xl">
              Mesa principal
            </h2>
          </div>

          <Link
            to="/cargar-personaje"
            className="gold-border-btn inline-flex items-center gap-2 px-6 py-3 font-display text-xs uppercase tracking-[0.2em] text-primary transition-all"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Cargar personaje
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              characterCount={countCharactersByPlayer(player.id)}
            />
          ))}
        </div>

        <StatsSection characterCount={characters.length} />

        <section id="archivo" className="mt-24">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
            <p className="mb-3 font-label text-xs uppercase tracking-[0.3em] text-primary">
              Archivo de campañas
            </p>
            <h2 className="font-display text-3xl text-on-surface epic-title md:text-4xl">
              Crónicas abiertas
            </h2>
            </div>
            <Link
              to="/campanas"
              className="gold-border-btn px-6 py-3 text-center font-display text-xs uppercase tracking-[0.2em] text-primary transition-all"
            >
              Ver todas las campañas
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {campaigns.map((campaign) => (
              <article className="fantasy-card p-6" key={campaign.id}>
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-primary">
                  {campaign.status}
                </p>
                <h3 className="mt-3 font-display text-2xl text-on-surface epic-title">
                  {campaign.name}
                </h3>
                <p className="mt-4 leading-7 text-on-surface-variant">{campaign.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
