import { ImagePlus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import OrnateCorners from "../components/OrnateCorners.jsx";
import CampaignImage, { campaignPhotoSource, normalizeCampaignPhoto } from "../components/CampaignImage.jsx";
import { createCampaign, deleteCampaign, fetchCampaigns, updateCampaign } from "../services/campaignsApi.js";

const initialForm = {
  name: "",
  status: "Activa",
  summary: "",
  history: "",
  photos: [],
};

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => { image.src = String(reader.result); };
    reader.onerror = reject;
    image.onerror = reject;
    image.onload = () => {
      const maxSize = 1200;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    reader.readAsDataURL(file);
  });
}

export default function CampaignFormPage({ mode = "create" }) {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const isEditing = mode === "edit";
  const [form, setForm] = useState(initialForm);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoEditor, setPhotoEditor] = useState(null);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    fetchCampaigns().then((campaigns) => {
      const campaign = campaigns.find((item) => item.id === campaignId);
      if (!campaign) {
        setNotFound(true);
      } else {
        setForm({ ...initialForm, ...campaign, photos: campaign.photos ?? [] });
      }
      setIsLoading(false);
    });
  }, [campaignId, isEditing]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function addPhotoFiles(event) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const images = await Promise.all(files.map(resizeImage));
    setPhotoEditor({ ...normalizeCampaignPhoto(images[0]), index: null });
    setPendingPhotos(images.slice(1));
    event.target.value = "";
  }

  function addPhotoUrl() {
    const url = photoUrl.trim();
    if (!url) return;
    setPhotoEditor({ ...normalizeCampaignPhoto(url), index: null });
    setPhotoUrl("");
  }

  function editPhoto(photo, index) {
    setPendingPhotos([]);
    setPhotoEditor({ ...normalizeCampaignPhoto(photo), index });
  }

  function updatePhotoEditor(event) {
    const { name, value } = event.target;
    setPhotoEditor((current) => ({ ...current, [name]: Number(value) }));
  }

  function confirmPhotoAdjustment() {
    const { index, ...adjustedPhoto } = photoEditor;
    setForm((current) => ({
      ...current,
      photos:
        index === null
          ? [...current.photos, adjustedPhoto]
          : current.photos.map((photo, photoIndex) => (photoIndex === index ? adjustedPhoto : photo)),
    }));

    if (pendingPhotos.length) {
      setPhotoEditor({ ...normalizeCampaignPhoto(pendingPhotos[0]), index: null });
      setPendingPhotos((current) => current.slice(1));
    } else {
      setPhotoEditor(null);
    }
  }

  function cancelPhotoAdjustment() {
    setPhotoEditor(null);
    setPendingPhotos([]);
  }

  function removePhoto(index) {
    setForm((current) => ({ ...current, photos: current.photos.filter((_, itemIndex) => itemIndex !== index) }));
  }

  function makeCover(index) {
    setForm((current) => {
      const photos = [...current.photos];
      const [cover] = photos.splice(index, 1);
      return { ...current, photos: [cover, ...photos] };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const saved = isEditing ? await updateCampaign(campaignId, form) : await createCampaign(form);
      navigate(`/campanas/${saved.id}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar la campaña ${form.name}?`)) return;
    await deleteCampaign(campaignId);
    navigate("/campanas");
  }

  if (notFound) return <Navigate to="/campanas" replace />;
  if (isLoading) return <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">Cargando campaña...</main>;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16">
      <header className="mb-12">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">Archivo de campañas</p>
        <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-on-surface epic-title md:text-7xl">
          {isEditing ? "Editar campaña" : "Nueva campaña"}
        </h1>
        <div className="mt-6 h-1 w-24 bg-primary" />
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="fantasy-card p-8">
          <OrnateCorners />
          <div className="space-y-5">
            <label className="form-field">
              <span>Nombre</span>
              <input name="name" value={form.name} onChange={updateField} required />
            </label>
            <label className="form-field">
              <span>Estado</span>
              <select name="status" value={form.status} onChange={updateField}>
                <option>Activa</option><option>Abierta</option><option>En pausa</option><option>Finalizada</option><option>Archivada</option>
              </select>
            </label>
            <label className="form-field">
              <span>Resumen para la tarjeta</span>
              <textarea name="summary" rows="4" value={form.summary} onChange={updateField} />
            </label>
            <label className="form-field">
              <span>Historia de la campaña</span>
              <textarea name="history" rows="14" value={form.history} onChange={updateField} placeholder="Contá acá la historia, los acontecimientos, lugares y leyendas de la campaña..." />
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="fantasy-card p-8">
            <OrnateCorners />
            <div className="flex items-center gap-3 text-primary">
              <ImagePlus className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-display text-2xl epic-title">Fotos</h2>
            </div>
            <p className="mt-3 text-sm text-on-surface-variant">La primera foto será la portada. Podés agregar todas las que quieras.</p>

            <label className="form-field mt-6">
              <span>Subir imágenes</span>
              <input type="file" accept="image/*" multiple onChange={addPhotoFiles} />
            </label>

            <div className="mt-5 flex gap-3">
              <input className="w-full border border-primary/30 bg-black/30 px-4 py-3 text-on-surface outline-none focus:border-primary" value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} placeholder="O pegá una URL de imagen" />
              <button type="button" onClick={addPhotoUrl} className="gold-border-btn px-5 font-display text-xs uppercase tracking-wider text-primary">Agregar</button>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4">
              {form.photos.map((photo, index) => (
                <div className="relative aspect-[4/3] overflow-hidden border border-primary/30" key={`${campaignPhotoSource(photo).slice(0, 30)}-${index}`}>
                  <CampaignImage photo={photo} alt={`Foto ${index + 1}`} />
                  {index === 0 ? <span className="absolute left-2 top-2 bg-primary px-2 py-1 font-label text-[9px] uppercase tracking-wider text-black">Portada</span> : null}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/80 p-2">
                    <div className="flex gap-3">
                      {index > 0 ? <button type="button" onClick={() => makeCover(index)} className="text-[10px] uppercase text-primary">Portada</button> : null}
                      <button type="button" onClick={() => editPhoto(photo, index)} className="text-[10px] uppercase text-primary">Ajustar</button>
                    </div>
                    <button type="button" onClick={() => removePhoto(index)} aria-label="Quitar foto" className="text-red-300"><X className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="fantasy-card p-8">
            <OrnateCorners />
            <button type="submit" disabled={isSaving} className="gold-border-btn inline-flex w-full items-center justify-center gap-2 px-6 py-4 font-display text-sm uppercase tracking-[0.2em] text-primary disabled:opacity-60">
              <Save className="h-4 w-4" /> {isSaving ? "Guardando..." : "Guardar campaña"}
            </button>
            {isEditing ? <button type="button" onClick={handleDelete} className="danger-border-btn mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-4 font-display text-sm uppercase tracking-[0.2em]"><Trash2 className="h-4 w-4" /> Eliminar campaña</button> : null}
          </section>
        </aside>
      </form>

      {photoEditor ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <section className="fantasy-card max-h-[95vh] w-full max-w-3xl overflow-y-auto p-6 md:p-9">
            <OrnateCorners />
            <h2 className="font-display text-3xl text-primary epic-title">Ajustar imagen</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Mové los controles hasta que el recorte quede como querés.</p>

            <div className="mt-6 aspect-[16/9] w-full overflow-hidden border border-primary/40 bg-black">
              <CampaignImage photo={photoEditor} alt="Vista previa del ajuste" />
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <label className="form-field">
                <span>Horizontal: {photoEditor.positionX}%</span>
                <input type="range" name="positionX" min="0" max="100" value={photoEditor.positionX} onChange={updatePhotoEditor} />
              </label>
              <label className="form-field">
                <span>Vertical: {photoEditor.positionY}%</span>
                <input type="range" name="positionY" min="0" max="100" value={photoEditor.positionY} onChange={updatePhotoEditor} />
              </label>
              <label className="form-field">
                <span>Zoom: {Number(photoEditor.zoom).toFixed(1)}x</span>
                <input type="range" name="zoom" min="1" max="3" step="0.1" value={photoEditor.zoom} onChange={updatePhotoEditor} />
              </label>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={cancelPhotoAdjustment} className="danger-border-btn px-6 py-3 font-display text-xs uppercase tracking-[0.18em]">Cancelar</button>
              <button type="button" onClick={confirmPhotoAdjustment} className="gold-border-btn px-6 py-3 font-display text-xs uppercase tracking-[0.18em] text-primary">Usar este encuadre</button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
