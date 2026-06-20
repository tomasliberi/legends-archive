import { BookOpen, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import OrnateCorners from "./OrnateCorners.jsx";
import CampaignImage from "./CampaignImage.jsx";

export default function CampaignCard({ campaign }) {
  const cover = campaign.photos?.[0];

  return (
    <article className="fantasy-card flex h-full flex-col overflow-hidden">
      <OrnateCorners />
      {cover ? (
        <div className="aspect-[16/9] overflow-hidden border-b border-primary/30">
          <CampaignImage photo={cover} alt={`Portada de ${campaign.name}`} />
        </div>
      ) : (
        <div className="black-paper flex aspect-[16/9] items-center justify-center border-b border-primary/20 text-primary/50">
          <BookOpen className="h-12 w-12" aria-hidden="true" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-7">
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-primary">
          {campaign.status}
        </p>
        <h2 className="mt-3 font-display text-3xl text-on-surface epic-title">{campaign.name}</h2>
        <p className="mt-4 flex-1 leading-7 text-on-surface-variant">{campaign.summary}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to={`/campanas/${campaign.id}`}
            className="gold-border-btn inline-flex items-center gap-2 px-5 py-3 font-display text-xs uppercase tracking-[0.16em] text-primary transition-all"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Ver historia
          </Link>
          <Link
            to={`/editar-campana/${campaign.id}`}
            className="gold-border-btn inline-flex items-center gap-2 px-5 py-3 font-display text-xs uppercase tracking-[0.16em] text-primary transition-all"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Editar
          </Link>
        </div>
      </div>
    </article>
  );
}
