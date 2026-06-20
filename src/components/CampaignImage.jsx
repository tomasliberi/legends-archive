export function normalizeCampaignPhoto(photo) {
  if (typeof photo === "string") {
    return { src: photo, positionX: 50, positionY: 50, zoom: 1 };
  }

  return {
    src: photo?.src ?? "",
    positionX: Number(photo?.positionX ?? 50),
    positionY: Number(photo?.positionY ?? 50),
    zoom: Number(photo?.zoom ?? 1),
  };
}

export function getCampaignPhotoStyle(photo) {
  const normalized = normalizeCampaignPhoto(photo);
  return {
    objectPosition: `${normalized.positionX}% ${normalized.positionY}%`,
    transform: `scale(${normalized.zoom})`,
    transformOrigin: `${normalized.positionX}% ${normalized.positionY}%`,
  };
}

export function campaignPhotoSource(photo) {
  return normalizeCampaignPhoto(photo).src;
}

export default function CampaignImage({ photo, alt, className = "" }) {
  return (
    <img
      src={campaignPhotoSource(photo)}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      style={getCampaignPhotoStyle(photo)}
    />
  );
}
