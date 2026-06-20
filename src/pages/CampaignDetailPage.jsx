import { ArrowLeft, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import OrnateCorners from "../components/OrnateCorners.jsx";
import CampaignImage, { campaignPhotoSource } from "../components/CampaignImage.jsx";
import { fetchCampaigns } from "../services/campaignsApi.js";

export default function CampaignDetailPage() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(undefined);

  useEffect(() => {
    fetchCampaigns().then((items) => setCampaign(items.find((item) => item.id === campaignId) ?? null));
  }, [campaignId]);

  if (campaign === undefined) {
    return <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">Cargando campaña...</main>;
  }

  if (!campaign) return <Navigate to="/campanas" replace />;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">
      <div className="flex flex-wrap justify-between gap-4">
        <Link to="/campanas" className="gold-border-btn inline-flex items-center gap-2 px-6 py-3 font-display text-xs uppercase tracking-[0.18em] text-primary transition-all">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver
        </Link>
        <Link to={`/editar-campana/${campaign.id}`} className="gold-border-btn inline-flex items-center gap-2 px-6 py-3 font-display text-xs uppercase tracking-[0.18em] text-primary transition-all">
          <Pencil className="h-4 w-4" aria-hidden="true" /> Editar campaña
        </Link>
      </div>

      <article className="fantasy-card mt-10 p-8 md:p-12">
        <OrnateCorners />
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">{campaign.status}</p>
        <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.07em] text-on-surface epic-title md:text-7xl">{campaign.name}</h1>
        <div className="mt-6 h-1 w-24 bg-primary" />
        <p className="mt-7 max-w-4xl text-xl italic leading-9 text-on-surface-variant">{campaign.summary}</p>

        <section className="mt-12">
          <h2 className="font-display text-3xl text-primary epic-title">Historia</h2>
          <p className="mt-5 whitespace-pre-wrap text-lg leading-9 text-on-surface-variant">{campaign.history}</p>
        </section>

        {campaign.photos?.length ? (
          <section className="mt-14">
            <h2 className="font-display text-3xl text-primary epic-title">Galería</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {campaign.photos.map((photo, index) => (
                <a href={campaignPhotoSource(photo)} target="_blank" rel="noreferrer" key={`${campaign.id}-${index}`} className="block aspect-[4/3] overflow-hidden border border-primary/30">
                  <CampaignImage photo={photo} alt={`${campaign.name}, imagen ${index + 1}`} />
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
