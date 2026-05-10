import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowRight, FileText, BookOpen, MessageSquare, Star, X, Save } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { formationAPI } from "../../api/api";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/formateur", icon: <FileText size={18} /> },
  { label: "Mon profil", href: "/profil/formateur", icon: <Star size={18} /> },
  { label: "Mes candidatures", href: "/formateur/candidatures", icon: <FileText size={18} /> },
  { label: "Mes formations", href: "/formateur/formations", icon: <BookOpen size={18} /> },
  { label: "Messagerie", href: "/formateur/messages", icon: <MessageSquare size={18} /> },
  { label: "Offres disponibles", href: "/recherche/offres", icon: <ArrowRight size={18} /> },
];

const NIVEAUX = ["débutant", "intermédiaire", "avancé"];

const FORM_INIT = { titre: "", description: "", duree: "", prix: "", niveau: "débutant" };

const Formations = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(FORM_INIT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchFormations = async () => {
    try {
      const data = await formationAPI.getAll();
      setFormations(data.formations || []);
    } catch (err) {
      console.error("Erreur formations :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFormations(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(FORM_INIT);
    setError("");
    setShowModal(true);
  };

  const openEdit = (f) => {
    setEditing(f);
    setForm({ titre: f.titre, description: f.description, duree: f.duree, prix: f.prix, niveau: f.niveau });
    setError("");
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await formationAPI.update(editing.id, form);
      } else {
        await formationAPI.create(form);
      }
      setShowModal(false);
      fetchFormations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette formation ?")) return;
    try {
      await formationAPI.delete(id);
      setFormations(formations.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <DashboardLayout navigation={NAVIGATION}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes formations</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez vos formations publiées</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
        >
          <Plus size={16} /> Nouvelle formation
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-400">Chargement...</p>
        </div>
      ) : formations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 mb-4">Aucune formation publiée pour le moment</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg font-medium transition-all"
          >
            <Plus size={14} /> Publier ma première formation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formations.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-slate-900">{f.titre}</h3>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                  f.niveau === "débutant" ? "bg-emerald-50 text-emerald-700" :
                  f.niveau === "intermédiaire" ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-600"
                }`}>{f.niveau}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{f.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>⏱ {f.duree}h</span>
                  <span className="font-semibold text-blue-600">{Number(f.prix).toLocaleString()} FCFA</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(f)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal création / édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900 text-lg">
                {editing ? "Modifier la formation" : "Nouvelle formation"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Titre</label>
                <input
                  name="titre" value={form.titre} onChange={handleChange} required
                  placeholder="ex: Formation React.js de A à Z"
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange} required
                  placeholder="Décrivez le contenu de votre formation..."
                  rows={3}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Durée (heures)</label>
                  <input
                    type="number" name="duree" value={form.duree} onChange={handleChange} required min="1"
                    placeholder="ex: 40"
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Prix (FCFA)</label>
                  <input
                    type="number" name="prix" value={form.prix} onChange={handleChange} required min="0"
                    placeholder="ex: 150000"
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Niveau</label>
                <select
                  name="niveau" value={form.niveau} onChange={handleChange}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  {NIVEAUX.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all disabled:opacity-60"
                >
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

export default Formations;