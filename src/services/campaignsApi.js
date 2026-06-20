const API_URL = "/api/campaigns";
const STATIC_URL = `${import.meta.env.BASE_URL}data/campaigns.json`;
const STORAGE_KEY = "legends-archive-campaigns";

function canUseStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function readLocalCampaigns() {
  if (!canUseStorage()) return [];

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function writeLocalCampaigns(campaigns) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }
}

function mergeCampaigns(primary, secondary) {
  const byId = new Map();
  [...primary, ...secondary].forEach((campaign) => byId.set(campaign.id, campaign));
  return Array.from(byId.values());
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeCampaign(data, id) {
  return {
    id: id ?? `${slugify(data.name || "campaña")}-${Date.now()}`,
    name: data.name,
    status: data.status || "Activa",
    summary: data.summary || "Sin resumen todavía.",
    history: data.history || "La historia de esta campaña todavía no fue escrita.",
    photos: Array.isArray(data.photos)
      ? data.photos
          .map((photo) =>
            typeof photo === "string"
              ? { src: photo, positionX: 50, positionY: 50, zoom: 1 }
              : {
                  src: photo?.src ?? "",
                  positionX: Number(photo?.positionX ?? 50),
                  positionY: Number(photo?.positionY ?? 50),
                  zoom: Number(photo?.zoom ?? 1),
                },
          )
          .filter((photo) => photo.src)
      : [],
    updatedAt: id ? new Date().toISOString() : undefined,
  };
}

async function fetchStaticCampaigns() {
  const response = await fetch(STATIC_URL);
  if (!response.ok) throw new Error("No se pudieron cargar las campañas");
  return response.json();
}

export async function fetchCampaigns() {
  if (window.location.hostname.endsWith("github.io")) {
    return mergeCampaigns(await fetchStaticCampaigns().catch(() => []), readLocalCampaigns());
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron cargar las campañas");
    return response.json();
  } catch {
    return mergeCampaigns(await fetchStaticCampaigns().catch(() => []), readLocalCampaigns());
  }
}

export async function createCampaign(data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("No se pudo guardar la campaña");
    return response.json();
  } catch {
    const campaign = normalizeCampaign(data);
    writeLocalCampaigns([...readLocalCampaigns(), campaign]);
    return campaign;
  }
}

export async function updateCampaign(id, data) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("No se pudo actualizar la campaña");
    return response.json();
  } catch {
    const campaign = normalizeCampaign(data, id);
    const campaigns = readLocalCampaigns();
    const exists = campaigns.some((item) => item.id === id);
    writeLocalCampaigns(
      exists ? campaigns.map((item) => (item.id === id ? campaign : item)) : [...campaigns, campaign],
    );
    return campaign;
  }
}

export async function deleteCampaign(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("No se pudo eliminar la campaña");
  } catch {
    writeLocalCampaigns(readLocalCampaigns().filter((campaign) => campaign.id !== id));
  }
}
