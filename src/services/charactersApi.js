const API_URL = "/api/characters";
const STORAGE_KEY = "legends-archive-characters";

function canUseStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function getLocalCharacters() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function writeLocalCharacters(characters) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }
}

function saveLocalCharacter(character) {
  const characters = getLocalCharacters();
  writeLocalCharacters([...characters, character]);
  return character;
}

function updateLocalCharacter(characterId, character) {
  const characters = getLocalCharacters();
  const updatedCharacters = characters.map((item) =>
    item.id === characterId ? { ...item, ...character, id: characterId } : item,
  );
  writeLocalCharacters(updatedCharacters);
  return updatedCharacters.find((item) => item.id === characterId) ?? character;
}

function deleteLocalCharacter(characterId) {
  writeLocalCharacters(getLocalCharacters().filter((item) => item.id !== characterId));
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeLocalCharacter(characterData, existingId) {
  const baseId = slugify(characterData.name || "personaje");
  const traits =
    typeof characterData.traits === "string"
      ? characterData.traits
          .split(",")
          .map((trait) => trait.trim())
          .filter(Boolean)
      : characterData.traits ?? [];

  return {
    id: existingId ?? `${baseId}-${Date.now()}`,
    playerId: characterData.playerId,
    name: characterData.name,
    className: characterData.className || "Clase sin definir",
    race: characterData.race || "Raza sin definir",
    level: Number(characterData.level) || 1,
    alignment: characterData.alignment || "Sin definir",
    campaignId: characterData.campaignId || "mesa-principal",
    status: characterData.status || "Vivo",
    photo: characterData.photo || "",
    description: characterData.description || "Sin descripción todavía.",
    backstory: characterData.backstory || "Historia pendiente de escribir.",
    traits,
    updatedAt: existingId ? new Date().toISOString() : undefined,
  };
}

export async function fetchCharacters() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los personajes");
    }

    return await response.json();
  } catch {
    return getLocalCharacters();
  }
}

export async function createCharacter(characterData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(characterData),
    });

    if (!response.ok) {
      throw new Error("No se pudo guardar el personaje");
    }

    return await response.json();
  } catch {
    return saveLocalCharacter(normalizeLocalCharacter(characterData));
  }
}

export async function updateCharacter(characterId, characterData) {
  try {
    const response = await fetch(`${API_URL}/${characterId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(characterData),
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar el personaje");
    }

    return await response.json();
  } catch {
    return updateLocalCharacter(characterId, normalizeLocalCharacter(characterData, characterId));
  }
}

export async function deleteCharacter(characterId) {
  try {
    const response = await fetch(`${API_URL}/${characterId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar el personaje");
    }
  } catch {
    deleteLocalCharacter(characterId);
  }
}
