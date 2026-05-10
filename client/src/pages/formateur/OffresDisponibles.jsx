import { useState, useEffect } from "react";
import { Search, MapPin, Send, X, FileText, BookOpen, MessageSquare, Star, ArrowRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { offreAPI, candidatureAPI } from "../../api/api";
import Badge from "../../components/ui/Badge";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/formateur", icon: <FileText size={18} /> },
  { label: "Mon profil", href: "/profil/formateur", icon: <Star size={18} /> },
  { label: "Mes candidatures", href: "/formateur/candidatures", icon: <FileText size={18} /> },
  { label: "Mes formations", href: "/formateur/formations", icon: <BookOpen size={18} /> },
  { label: "Messagerie", href: "/formateur/messages", icon: <MessageSquare size={18} /> },
  { label: "Offres disponibles", href: "/recherche/offres", icon: <ArrowRight size={18} /> },
];

const OffresDisponibles = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ competence: "", localisation: "" });
  const [activeOffre, setActiveOffre] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchOffres = async (filtres = {}) => {
    setLoading(true);
    try {
      const data = Object.values(filtres).some(Boolean)
        ? await offreAPI.search(filtres)
        : await offreAPI.getAll();
      setOffres(data.offres || []);
    } catch (err) {
      console.error("Erreur offres :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffres(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOffres(search);
  };

  const handlePostuler = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await candidatureAPI.postuler({ offre_id: activeOffre.id, message });
      setSuccess("Candidature envoyée avec succès !");
      setActiveOffre(null);
      setMessage("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout navigation={NAVIGATION}>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Offres disponibles</h1>
        <p className="text-slate-500 text-sm mt-1">Trouvez et postulez aux offres qui correspondent à votre profil</p>
      </div>

      {/* Succès global */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-6">
          ✅ {success}
        </div>
      )}

      {/* Recherche */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 flex items-center gap-2 border border-slate-200 rounded-lg px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={search.competence}
            onChange={(e) => setSearch({ ...search, competence: e.target.value })}
            placeholder="Compétence (ex: React)"
            className="flex-1 py-2.5 text-sm outline-none bg-transparent"
          />
        </div>
        <div className="flex-1 min-w-48 flex items-center gap-2 border border-slate-200 rounded-lg px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <MapPin size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={search.localisation}
            onChange={(e) => setSearch({ ...search, localisation: e.target.value })}
            placeholder="Localisation (ex: Brazzaville)"
            className="flex-1 py-2.5 text-sm outline-none bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          Rechercher
        </button>
        {(search.competence || search.localisation) && (
          <button
            type="button"
            onClick={() => { setSearch({ competence: "", localisation: "" }); fetchOffres(); }}
            className="px-4 py-2.5 text-slate-500 hover:text-slate-700 text-sm border border-slate-200 rounded-lg transition-all"
          >
            Réinitialiser
          </button>
        )}
      </form>

      {/* Liste offres */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-400">Chargement...</p>
        </div>
      ) : offres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400">Aucune offre trouvée</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {offres.map((o, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {o.competences?.map((c) => <Badge key={c}>{c}</Badge>)}
                    <Badge variant="green">Ouverte</Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{o.titre}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                    <MapPin size={13} /> {o.institution_nom} · {o.localisation}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-2">{o.description}</p>
                </div>
                <button
                  onClick={() => { setActiveOffre(o); setError(""); setMessage(""); }}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all"
                >
                  <Send size={14} /> Postuler
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal postuler */}
      {activeOffre && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Postuler à l'offre</h2>
              <button onClick={() => setActiveOffre(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <p className="font-semibold text-slate-900 text-sm">{activeOffre.titre}</p>
              <p className="text-xs text-slate-500 mt-1">{activeOffre.institution_nom}</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handlePostuler} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Message de motivation</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Présentez-vous et expliquez pourquoi vous êtes le candidat idéal..."
                  rows={4}
                  className="px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveOffre(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all disabled:opacity-60"
                >
                  <Send size={14} />
                  {sending ? "Envoi..." : "Envoyer ma candidature"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OffresDisponibles;