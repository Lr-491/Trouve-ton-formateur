import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, FileText, Users, MessageSquare, ArrowRight, Building2, MapPin } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { offreAPI } from "../../api/api";
import Badge from "../../components/ui/Badge";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/institution", icon: <Building2 size={18} /> },
  { label: "Mon profil", href: "/profil/institution", icon: <Building2 size={18} /> },
  { label: "Mes offres", href: "/institution/offres", icon: <FileText size={18} /> },
  { label: "Candidatures reçues", href: "/institution/candidatures", icon: <Users size={18} /> },
  { label: "Messagerie", href: "/institution/messages", icon: <MessageSquare size={18} /> },
  { label: "Recherche formateurs", href: "/recherche/formateurs", icon: <ArrowRight size={18} /> },
];

const STATUTS = ["ouverte", "fermée", "pourvue"];
const FORM_INIT = { titre: "", description: "", competences: [], localisation: "", statut: "ouverte" };

const Offres = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(FORM_INIT);
  const [competenceInput, setCompetenceInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchOffres = async () => {
    try {
      const data = await offreAPI.getAll();
      setOffres(data.offres || []);
    } catch (err) {
      console.error("Erreur offres :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffres(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(FORM_INIT);
    setError("");
    setShowModal(true);
  };

  const openEdit = (o) => {
    setEditing(o);
    setForm({
      titre: o.titre, description: o.description,
      competences: o.competences || [],
      localisation: o.localisation, statut: o.statut,
    });
    setError("");
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addCompetence = (c) => {
    const trimmed = c.trim();
    if (trimmed && !form.competences.includes(trimmed)) {
      setForm({ ...form, competences: [...form.competences, trimmed] });
    }
    setCompetenceInput("");
  };

  const removeCompetence = (c) => setForm({ ...form, competences: form.competences.filter((x) => x !== c) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) await offreAPI.update(editing.id, form);
      else await offreAPI.create(form);
      setShowModal(false);
      fetchOffres();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette offre ?")) return;
    try {
      await offreAPI.delete(id);
      setOffres(offres.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <DashboardLayout navigation={NAVIGATION}>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes offres</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez vos offres de formation</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
        >
          <Plus size={16} /> Nouvelle offre
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-400">Chargement...</p>
        </div>
      ) : offres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 mb-4">Aucune offre publiée</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg font-medium transition-all">
            <Plus size={14} /> Publier ma première offre
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {offres.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {o.competences?.map((c) => <Badge key={c}>{c}</Badge>)}
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      o.statut === "ouverte" ? "bg-emerald-50 text-emerald-700" :
                      o.statut === "fermée" ? "bg-red-50 text-red-600" :
                      "bg-slate-100 text-slate-600"
                    }`}>{o.statut}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{o.titre}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                    <MapPin size={13} /> {o.localisation}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-2">{o.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(o)} className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(o.id)} className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900 text-lg">{editing ? "Modifier l'offre" : "Nouvelle offre"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Titre</label>
                <input name="titre" value={form.titre} onChange={handleChange} required placeholder="ex: Formateur en développement web"
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                  placeholder="Décrivez le poste et les missions..."
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Compétences requises</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.competences.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                      {c}
                      <button type="button" onClick={() => removeCompetence(c)} className="text-blue-400 hover:text-blue-700">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" value={competenceInput}
                    onChange={(e) => setCompetenceInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCompetence(competenceInput); } }}
                    placeholder="ex: React.js"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button type="button" onClick={() => addCompetence(competenceInput)}
                    className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all">
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Localisation</label>
                  <input name="localisation" value={form.localisation} onChange={handleChange}
                    placeholder="ex: Brazzaville"
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Statut</label>
                  <select name="statut" value={form.statut} onChange={handleChange}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                    {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all disabled:opacity-60">
                  <Save size={15} />
                  {saving ? "Sauvegarde..." : editing ? "Modifier" : "Publier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Offres;