import { useState, useEffect } from "react";
import { Save, Building2, MapPin, Globe, FileText, Users, MessageSquare, ArrowRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { institutionAPI } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/institution", icon: <Building2 size={18} /> },
  { label: "Mon profil", href: "/profil/institution", icon: <Building2 size={18} /> },
  { label: "Mes offres", href: "/institution/offres", icon: <FileText size={18} /> },
  { label: "Candidatures reçues", href: "/institution/candidatures", icon: <Users size={18} /> },
  { label: "Messagerie", href: "/institution/messages", icon: <MessageSquare size={18} /> },
  { label: "Recherche formateurs", href: "/recherche/formateurs", icon: <ArrowRight size={18} /> },
];

const SECTEURS = [
  "Éducation supérieure", "Formation professionnelle", "Informatique",
  "Santé", "Finance", "Droit", "Ingénierie", "Art & Design", "Autre",
];

const ProfilInstitution = () => {
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);
  const [form, setForm] = useState({ nom: "", secteur: "", description: "", localisation: "", site_web: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await institutionAPI.getProfil(user.id);
        setProfil(data.profil);
        setForm({
          nom: data.profil.nom || "",
          secteur: data.profil.secteur || "",
          description: data.profil.description || "",
          localisation: data.profil.localisation || "",
          site_web: data.profil.site_web || "",
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
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await institutionAPI.updateProfil(profil.id, form);
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
        <p className="text-slate-500 text-sm mt-1">Complétez votre profil pour attirer les meilleurs formateurs</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
            ✅ Profil mis à jour avec succès !
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Infos principales */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Informations de l'institution</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Nom de l'institution</label>
              <input
                type="text" name="nom" value={form.nom} onChange={handleChange}
                placeholder="ex: Institut Supérieur du Congo"
                className="px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Secteur</label>
              <select
                name="secteur" value={form.secteur} onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              >
                <option value="">Sélectionner un secteur</option>
                {SECTEURS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Localisation & Site web */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Localisation & Contact</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Localisation</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" name="localisation" value={form.localisation} onChange={handleChange}
                  placeholder="ex: Brazzaville, Congo"
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Site web</label>
              <div className="relative">
                <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" name="site_web" value={form.site_web} onChange={handleChange}
                  placeholder="ex: www.institution.com"
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Description</h2>
          </div>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="Décrivez votre institution, vos missions et vos valeurs..."
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
          <p className="text-xs text-slate-400 mt-2">{form.description.length} caractères</p>
        </div>

        <button
          type="submit" disabled={saving}
          className="flex items-center justify-center gap-2 w-full md:w-auto md:self-end bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Sauvegarde..." : "Sauvegarder le profil"}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default ProfilInstitution;