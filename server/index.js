import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const charactersFile = path.join(dataDir, "characters.json");
const campaignsFile = path.join(dataDir, "campaigns.json");
const app = express();
const port = process.env.PORT ?? 8080;

app.use(cors());
app.use(express.json({ limit: "15mb" }));

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizePortraitValue(value, fallback, min, max) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? Math.min(max, Math.max(min, parsedValue)) : fallback;
}

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });

  if (!existsSync(charactersFile)) {
    await writeFile(charactersFile, "[]", "utf8");
  }
}

async function readCharacters() {
  await ensureStore();
  const content = await readFile(charactersFile, "utf8");
  const parsedContent = JSON.parse(content.replace(/^\uFEFF/, ""));
  return Array.isArray(parsedContent) ? parsedContent : [parsedContent];
}

async function writeCharacters(characters) {
  await ensureStore();
  await writeFile(charactersFile, `${JSON.stringify(characters, null, 2)}\n`, "utf8");
}

async function readCampaigns() {
  await ensureStore();
  const content = await readFile(campaignsFile, "utf8");
  const parsedContent = JSON.parse(content.replace(/^\uFEFF/, ""));
  return Array.isArray(parsedContent) ? parsedContent : [parsedContent];
}

async function writeCampaigns(campaigns) {
  await writeFile(campaignsFile, `${JSON.stringify(campaigns, null, 2)}\n`, "utf8");
}

function normalizeCampaign(campaignData, existingCampaign = {}) {
  return {
    ...existingCampaign,
    id: existingCampaign.id ?? `${slugify(campaignData.name || "campaña")}-${Date.now()}`,
    name: campaignData.name,
    status: campaignData.status || "Activa",
    summary: campaignData.summary || "Sin resumen todavía.",
    history: campaignData.history || "La historia de esta campaña todavía no fue escrita.",
    photos: Array.isArray(campaignData.photos)
      ? campaignData.photos
          .map((photo) =>
            typeof photo === "string"
              ? { src: photo, positionX: 50, positionY: 50, zoom: 1 }
              : {
                  src: photo?.src ?? "",
                  positionX: normalizePortraitValue(photo?.positionX, 50, 0, 100),
                  positionY: normalizePortraitValue(photo?.positionY, 50, 0, 100),
                  zoom: normalizePortraitValue(photo?.zoom, 1, 1, 3),
                },
          )
          .filter((photo) => photo.src)
      : [],
    createdAt: existingCampaign.createdAt ?? new Date().toISOString(),
    updatedAt: existingCampaign.id ? new Date().toISOString() : existingCampaign.updatedAt,
  };
}

function normalizeCharacter(characterData, existingCharacter = {}) {
  const baseId = slugify(characterData.name || existingCharacter.name || "personaje");
  const traits =
    typeof characterData.traits === "string"
      ? characterData.traits
          .split(",")
          .map((trait) => trait.trim())
          .filter(Boolean)
      : characterData.traits ?? [];

  return {
    ...existingCharacter,
    id: existingCharacter.id ?? `${baseId}-${Date.now()}`,
    playerId: characterData.playerId,
    name: characterData.name,
    className: characterData.className || "Clase sin definir",
    race: characterData.race || "Raza sin definir",
    level: Number(characterData.level) || 1,
    alignment: characterData.alignment || "Sin definir",
    campaignId: characterData.campaignId || "mesa-principal",
    status: characterData.status || "Vivo",
    photo: characterData.photo || "",
    photoPositionX: normalizePortraitValue(characterData.photoPositionX, 50, 0, 100),
    photoPositionY: normalizePortraitValue(characterData.photoPositionY, 50, 0, 100),
    photoZoom: normalizePortraitValue(characterData.photoZoom, 1, 1, 3),
    description: characterData.description || "Sin descripción todavía.",
    backstory: characterData.backstory || "Historia pendiente de escribir.",
    traits,
    createdAt: existingCharacter.createdAt ?? new Date().toISOString(),
    updatedAt: existingCharacter.id ? new Date().toISOString() : existingCharacter.updatedAt,
  };
}

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/characters", async (_request, response, next) => {
  try {
    response.json(await readCharacters());
  } catch (error) {
    next(error);
  }
});

app.get("/api/characters/:id", async (request, response, next) => {
  try {
    const characters = await readCharacters();
    const character = characters.find((item) => item.id === request.params.id);

    if (!character) {
      response.status(404).json({ message: "Personaje no encontrado" });
      return;
    }

    response.json(character);
  } catch (error) {
    next(error);
  }
});

app.post("/api/characters", async (request, response, next) => {
  try {
    if (!request.body.playerId || !request.body.name) {
      response.status(400).json({ message: "playerId y name son obligatorios" });
      return;
    }

    const characters = await readCharacters();
    const newCharacter = normalizeCharacter(request.body);
    const updatedCharacters = [...characters, newCharacter];
    await writeCharacters(updatedCharacters);

    response.status(201).json(newCharacter);
  } catch (error) {
    next(error);
  }
});

app.put("/api/characters/:id", async (request, response, next) => {
  try {
    if (!request.body.playerId || !request.body.name) {
      response.status(400).json({ message: "playerId y name son obligatorios" });
      return;
    }

    const characters = await readCharacters();
    const characterIndex = characters.findIndex((item) => item.id === request.params.id);

    if (characterIndex === -1) {
      response.status(404).json({ message: "Personaje no encontrado" });
      return;
    }

    const updatedCharacter = normalizeCharacter(request.body, characters[characterIndex]);
    characters[characterIndex] = updatedCharacter;
    await writeCharacters(characters);

    response.json(updatedCharacter);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/characters/:id", async (request, response, next) => {
  try {
    const characters = await readCharacters();
    const characterExists = characters.some((item) => item.id === request.params.id);

    if (!characterExists) {
      response.status(404).json({ message: "Personaje no encontrado" });
      return;
    }

    const updatedCharacters = characters.filter((item) => item.id !== request.params.id);
    await writeCharacters(updatedCharacters);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get("/api/campaigns", async (_request, response, next) => {
  try {
    response.json(await readCampaigns());
  } catch (error) {
    next(error);
  }
});

app.post("/api/campaigns", async (request, response, next) => {
  try {
    if (!request.body.name) {
      response.status(400).json({ message: "El nombre es obligatorio" });
      return;
    }

    const campaigns = await readCampaigns();
    const newCampaign = normalizeCampaign(request.body);
    await writeCampaigns([...campaigns, newCampaign]);
    response.status(201).json(newCampaign);
  } catch (error) {
    next(error);
  }
});

app.put("/api/campaigns/:id", async (request, response, next) => {
  try {
    const campaigns = await readCampaigns();
    const campaignIndex = campaigns.findIndex((item) => item.id === request.params.id);

    if (campaignIndex === -1) {
      response.status(404).json({ message: "Campaña no encontrada" });
      return;
    }

    campaigns[campaignIndex] = normalizeCampaign(request.body, campaigns[campaignIndex]);
    await writeCampaigns(campaigns);
    response.json(campaigns[campaignIndex]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/campaigns/:id", async (request, response, next) => {
  try {
    const campaigns = await readCampaigns();
    const updatedCampaigns = campaigns.filter((item) => item.id !== request.params.id);

    if (updatedCampaigns.length === campaigns.length) {
      response.status(404).json({ message: "Campaña no encontrada" });
      return;
    }

    await writeCampaigns(updatedCampaigns);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Error interno del servidor" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Legends Archive API escuchando en http://0.0.0.0:${port}`);
});
