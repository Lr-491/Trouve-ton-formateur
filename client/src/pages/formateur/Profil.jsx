import { useState, useEffect } from "react";
import { Save, User, MapPin, Briefcase, FileText, Wifi, WifiOff } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { formateurAPI } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { FileText as FileIcon, BookOpen, MessageSquare, Star, ArrowRight } from "lucide-react";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/formateur", icon: <FileIcon size={18} /> },
  { label: "Mon profil", href: "/profil/formateur", icon: <Star size={18} /> },
  { label: "Mes candidatures", href: "/formateur/candidatures", icon: <FileIcon size={18} /> },
  { label: "Mes formations", href: "/formateur/formations", icon: <BookOpen size={18} /> },
  { label: "Messagerie", href: "/formateur/messages", icon: <MessageSquare size={18} /> },
  { label: "Offres disponibles", href: "/recherche/offres", icon: <ArrowRight size={18} /> },
];

const COMPETENCES_SUGGESTIONS = [
  "React.js", "Node.js", "PostgreSQL", "Python", "JavaScript",
  "TypeScript", "Vue.js", "MongoDB", "Docker", "UI/UX", "Figma",
  "Data Science", "Machine Learning", "PHP", "Laravel",
];

const ProfilFormateur = () => {
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);
  const [form, setForm] = useState({
    nom: "", prenom: "", bio: "",
    competences: [], localisation: "", disponible: true, photo: "",
  });
  const [competenceInput, setCompetenceInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Charger le profil
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await formateurAPI.getProfil(user.id);
        setProfil(data.profil);
        setForm({
          nom: data.profil.nom || "",
          prenom: data.profil.prenom || "",
          bio: data.profil.bio || "",
          competences: data.profil.competences || [],
          localisation: data.profil.localisation || "",
          disponible: data.profil.disponible ?? true,
          photo: data.profil.photo || "",
        });
      } catch (err) {
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setSuccess(false);
  };

  // Ajouter une compétence
  const addCompetence = (comp) => {
    const trimmed = comp.trim();
    if (trimmed && !form.competences.includes(trimmed)) {
      setForm({ ...form, competences: [...form.competences, trimmed] });
    }
    setCompetenceInput("");
  };

  // Supprimer une compétence
  const removeCompetence = (comp) => {
    setForm({ ...form, competences: form.competences.filter((c) => c !== comp) });
  };

  // Sauvegarder
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await formateurAPI.updateProfil(profil.id, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout navigation={NAVIGATION}>
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Chargement...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout navigation={NAVIGATION}>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
        <p className="text-slate-500 text-sm mt-1">
          Complétez votre profil pour être visible par les institutions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">

        {/* Succès */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
            ✅ Profil mis à jour avec succès !
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Infos personnelles */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <User size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Informations personnelles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Prénom</label>
              <input
                type="text" name="prenom"
                value={form.prenom} onChange={handleChange}
                placeholder="Votre prénom"
                className="px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Nom</label>
              <input
                type="text" name="nom"
                value={form.nom} onChange={handleChange}
                placeholder="Votre nom"
                className="px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Localisation & Disponibilité */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Localisation & Disponibilité</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Localisation</label>
              <input
                type="text" name="localisation"
                value={form.localisation} onChange={handleChange}
                placeholder="ex: Brazzaville, Congo"
                className="px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Toggle disponibilité */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                {form.disponible
                  ? <Wifi size={18} className="text-emerald-600" />
                  : <WifiOff size={18} className="text-slate-400" />
                }
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {form.disponible ? "Disponible" : "Non disponible"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {form.disponible ? "Visible par les institutions" : "Masqué des recherches"}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox" name="disponible"
                  checked={form.disponible} onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Bio</h2>
          </div>
          <textarea
            name="bio" value={form.bio} onChange={handleChange}
            placeholder="Décrivez votre expérience, vos spécialités et ce qui vous distingue..."
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
          <p className="text-xs text-slate-400 mt-2">{form.bio.length} caractères</p>
        </div>

        {/* Compétences */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Compétences</h2>
          </div>

          {/* Tags compétences */}
          <div className="flex flex-wrap gap-2 mb-4">
            {form.competences.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full">
                {c}
                <button
                  type="button"
                  onClick={() => removeCompetence(c)}
                  className="text-blue-400 hover:text-blue-700 transition-colors text-base leading-none"
                >×</button>
              </span>
            ))}
            {form.competences.length === 0 && (
              <p className="text-sm text-slate-400">Aucune compétence ajoutée</p>
            )}
          </div>

          {/* Input compétence */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={competenceInput}
              onChange={(e) => setCompetenceInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCompetence(competenceInput); } }}
              placeholder="Ajouter une compétence..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              type="button"
              onClick={() => addCompetence(competenceInput)}
              className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
            >
              Ajouter
            </button>
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Suggestions :</p>
            <div className="flex flex-wrap gap-2">
              {COMPETENCES_SUGGESTIONS.filter(s => !form.competences.includes(s)).map((s) => (
                <button
                  key={s} type="button"
                  onClick={() => addCompetence(s)}
                  className="text-xs text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5 rounded-full transition-all"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <button
          type="submit" disabled={saving}
          className="flex items-center justify-center gap-2 w-full md:w-auto md:self-end bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? "Sauvegarde..." : "Sauvegarder le profil"}
        </button>

      </form>
    </DashboardLayout>
  );
};

export default ProfilFormateur;