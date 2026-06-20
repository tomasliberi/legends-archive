import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CampaignCard from "../components/CampaignCard.jsx";
import { fetchCampaigns } from "../services/campaignsApi.js";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns().then(setCampaigns);
  }, []);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">
      <header className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">Crónicas de la mesa</p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-on-surface epic-title md:text-7xl">
            Campañas
          </h1>
          <div className="mt-6 h-1 w-24 bg-primary" />
          <p className="mt-6 max-w-2xl text-lg italic text-on-surface-variant">
            Cada mundo, sus recuerdos y las imágenes que quedaron en la mesa.
          </p>
        </div>

        <Link
          to="/crear-campana"
          className="gold-border-btn inline-flex items-center justify-center gap-2 px-7 py-4 font-display text-xs uppercase tracking-[0.2em] text-primary transition-all"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nueva campaña
        </Link>
      </header>

      {campaigns.length ? (
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
        </section>
      ) : (
        <p className="fantasy-card p-10 text-center text-on-surface-variant">Todavía no hay campañas.</p>
      )}
    </main>
  );
}
