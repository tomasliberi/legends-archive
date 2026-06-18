import { Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import OrnateCorners from "../components/OrnateCorners.jsx";
import { campaigns, players } from "../data/mockData.js";
import {
  createCharacter,
  deleteCharacter,
  fetchCharacters,
  updateCharacter,
} from "../services/charactersApi.js";

const initialForm = {
  playerId: "tomi",
  name: "",
  className: "",
  race: "",
  level: 1,
  alignment: "",
  campaignId: "mesa-principal",
  status: "Vivo",
  photo: "",
  description: "",
  backstory: "",
  traits: "",
};

function characterToForm(character) {
  return {
    playerId: character.playerId ?? initialForm.playerId,
    name: character.name ?? "",
    className: character.className ?? "",
    race: character.race ?? "",
    level: character.level ?? 1,
    alignment: character.alignment ?? "",
    campaignId: character.campaignId ?? initialForm.campaignId,
    status: character.status ?? initialForm.status,
    photo: character.photo ?? "",
    description: character.description ?? "",
    backstory: character.backstory ?? "",
    traits: Array.isArray(character.traits) ? character.traits.join(", ") : character.traits ?? "",
  };
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      image.src = String(reader.result);
    };

    reader.onerror = reject;
    image.onerror = reject;

    image.onload = () => {
      const maxSize = 900;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };

    reader.readAsDataURL(file);
  });
}

export default function CharacterFormPage({ mode = "create" }) {
  const [searchParams] = useSearchParams();
  const { characterId } = useParams();
  const navigate = useNavigate();
  const playerFromUrl = searchParams.get("player");
  const defaultPlayer = players.some((player) => player.id === playerFromUrl)
    ? playerFromUrl
    : initialForm.playerId;
  const [form, setForm] = useState({ ...initialForm, playerId: defaultPlayer });
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [notFound, setNotFound] = useState(false);
  const isEditing = mode === "edit";

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    fetchCharacters().then((characters) => {
      const character = characters.find((item) => item.id === characterId);

      if (!character) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setForm(characterToForm(character));
      setPreview(character.photo ?? "");
      setIsLoading(false);
    });
  }, [characterId, isEditing]);

  const selectedPlayer = useMemo(
    () => players.find((player) => player.id === form.playerId),
    [form.playerId],
  );

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handlePhotoFile(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const result = await resizeImage(file);
    setForm((currentForm) => ({ ...currentForm, photo: result }));
    setPreview(result);
  }

  function handlePhotoUrl(event) {
    const { value } = event.target;
    setForm((currentForm) => ({ ...currentForm, photo: value }));
    setPreview(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const savedCharacter = isEditing
        ? await updateCharacter(characterId, form)
        : await createCharacter(form);

      navigate(`/players/${savedCharacter.playerId}/characters/${savedCharacter.id}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    const shouldDelete = window.confirm(`¿Eliminar a ${form.name}? Esta acción no se puede deshacer.`);

    if (!shouldDelete) {
      return;
    }

    await deleteCharacter(characterId);
    navigate(`/players/${form.playerId}`);
  }

  if (notFound) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
          Cargando personaje...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">
      <section className="mb-12">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
          Archivo de personajes
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-on-surface epic-title md:text-7xl">
          {isEditing ? "Editar personaje" : "Cargar personaje"}
        </h1>
        <div className="mt-6 h-1 w-24 bg-primary" />
        <p className="mt-6 max-w-2xl text-lg italic text-on-surface-variant">
          {isEditing
            ? "Modificá la ficha y guardá los cambios en el archivo compartido."
            : "Los personajes se guardan en el servidor de Legends Archive. Si otra persona entra a la misma app conectada a esta API, también puede verlos."}
        </p>
      </section>

      <form className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.7fr]" onSubmit={handleSubmit}>
        <section className="fantasy-card p-8">
          <OrnateCorners />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="form-field">
              <span>Jugador</span>
              <select name="playerId" value={form.playerId} onChange={updateField}>
                {players.map((player) => (
                  <option value={player.id} key={player.id}>
                    {player.name} - {player.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Campaña</span>
              <select name="campaignId" value={form.campaignId} onChange={updateField}>
                {campaigns.map((campaign) => (
                  <option value={campaign.id} key={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field md:col-span-2">
              <span>Nombre del personaje</span>
              <input name="name" value={form.name} onChange={updateField} required />
            </label>

            <label className="form-field">
              <span>Clase</span>
              <input name="className" value={form.className} onChange={updateField} />
            </label>

            <label className="form-field">
              <span>Raza</span>
              <input name="race" value={form.race} onChange={updateField} />
            </label>

            <label className="form-field">
              <span>Nivel</span>
              <input min="1" name="level" type="number" value={form.level} onChange={updateField} />
            </label>

            <label className="form-field">
              <span>Estado</span>
              <select name="status" value={form.status} onChange={updateField}>
                <option>Vivo</option>
                <option>Muerto</option>
                <option>Desaparecido</option>
                <option>Retirado</option>
              </select>
            </label>

            <label className="form-field md:col-span-2">
              <span>Alineamiento</span>
              <input name="alignment" value={form.alignment} onChange={updateField} />
            </label>

            <label className="form-field md:col-span-2">
              <span>Descripción corta</span>
              <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={updateField}
              />
            </label>

            <label className="form-field md:col-span-2">
              <span>Historia</span>
              <textarea name="backstory" rows="6" value={form.backstory} onChange={updateField} />
            </label>

            <label className="form-field md:col-span-2">
              <span>Rasgos separados por coma</span>
              <input
                name="traits"
                value={form.traits}
                onChange={updateField}
                placeholder="Valiente, torpe con la magia, juramento antiguo"
              />
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="fantasy-card p-8">
            <OrnateCorners />
            <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">Retrato</p>

            <div className="mt-6 aspect-[4/3] w-full overflow-hidden border border-primary/30 bg-black/30">
              {preview || form.photo ? (
                <img
                  src={preview || form.photo}
                  alt="Vista previa del personaje"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-8 text-center text-on-surface-variant">
                  La imagen aparecerá acá.
                </div>
              )}
            </div>

            <label className="form-field mt-6">
              <span>Subir imagen</span>
              <input accept="image/*" type="file" onChange={handlePhotoFile} />
            </label>

            <label className="form-field mt-5">
              <span>O pegar URL de imagen</span>
              <input value={form.photo.startsWith("data:") ? "" : form.photo} onChange={handlePhotoUrl} />
            </label>
          </section>

          <section className="fantasy-card p-8">
            <OrnateCorners />
            <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
              {isEditing ? "Se va a actualizar para" : "Se va a guardar para"}
            </p>
            <h2 className="mt-4 font-display text-4xl text-on-surface epic-title">
              {selectedPlayer?.name}
            </h2>
            <p className="mt-2 font-label text-xs uppercase tracking-widest text-primary">
              {selectedPlayer?.title}
            </p>

            <button
              type="submit"
              disabled={isSaving}
              className="gold-border-btn mt-8 inline-flex w-full items-center justify-center gap-2 px-6 py-4 font-display text-sm uppercase tracking-[0.2em] text-primary transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {isSaving
                ? isEditing
                  ? "Actualizando..."
                  : "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Guardar personaje"}
            </button>

            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="danger-border-btn mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-4 font-display text-sm uppercase tracking-[0.2em] transition-all"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Eliminar personaje
              </button>
            ) : null}
          </section>
        </aside>
      </form>
    </main>
  );
}
