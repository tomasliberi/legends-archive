export const campaigns = [
  {
    id: "mesa-principal",
    name: "Mesa principal",
    status: "Activa",
    summary: "La campaña actual de la mesa, lista para registrar personajes y sesiones.",
  },
  {
    id: "one-shots",
    name: "One-shots",
    status: "Abierta",
    summary: "Historias cortas, pruebas de personajes y aventuras autoconclusivas.",
  },
  {
    id: "archivo-antiguo",
    name: "Archivo antiguo",
    status: "Archivo",
    summary: "Campañas pasadas, héroes retirados y leyendas que todavía se nombran.",
  },
];

export const sessions = [
  { id: "s-001", campaignId: "mesa-principal", title: "La primera reunión", number: 1 },
  { id: "s-002", campaignId: "mesa-principal", title: "La misión inesperada", number: 2 },
  { id: "s-003", campaignId: "one-shots", title: "Una noche rara en la taberna", number: 1 },
];

export const players = [
  {
    id: "tomi",
    name: "Tomi",
    title: "El mentiroso",
    pronoun: "Jugador",
    icon: "Sparkles",
    accent: "from-[#10212d]",
    description:
      "El mentiroso de la mesa. Ideal para personajes con secretos, planes raros y coartadas dudosas.",
  },
  {
    id: "fran",
    name: "Fran",
    title: "Dungeon Master",
    pronoun: "DM",
    icon: "Crown",
    accent: "from-[#2d2410]",
    description:
      "Dungeon Master y guardián del caos narrativo. Maneja campañas, criaturas, reglas y consecuencias.",
  },
  {
    id: "santi",
    name: "Santi",
    title: "El loco",
    pronoun: "Jugador",
    icon: "Flame",
    accent: "from-[#2d1010]",
    description:
      "El loco de la mesa. Perfecto para personajes impulsivos, escenas intensas y decisiones imposibles de predecir.",
  },
  {
    id: "thiago",
    name: "Thiago",
    title: "El huevón",
    pronoun: "Jugador",
    icon: "Shield",
    accent: "from-[#102d1c]",
    description:
      "El huevón de la mesa. Personajes nobles, tercos o completamente perdidos encajan demasiado bien acá.",
  },
  {
    id: "benja",
    name: "Benja",
    title: "El inocente",
    pronoun: "Jugador",
    icon: "Heart",
    accent: "from-[#21102d]",
    description:
      "El inocente de la mesa. Ideal para héroes luminosos, personajes confiados y tragedias que duelen más.",
  },
];

export function getPlayerById(playerId) {
  return players.find((player) => player.id === playerId);
}

export function getCampaignById(campaignId) {
  return campaigns.find((campaign) => campaign.id === campaignId);
}

export function getSessionsByCampaign(campaignId) {
  return sessions.filter((session) => session.campaignId === campaignId);
}
