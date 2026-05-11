import { useState, useEffect } from "react";
import { Search, MapPin, Star, MessageSquare, Building2, FileText, Users, ArrowRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { formateurAPI, messageAPI } from "../../api/api";
import Badge from "../../components/ui/Badge";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/institution", icon: <Building2 size={18} /> },
  { label: "Mon profil", href: "/profil/institution", icon: <Building2 size={18} /> },
  { label: "Mes offres", href: "/institution/offres", icon: <FileText size={18} /> },
  { label: "Candidatures reçues", href: "/institution/candidatures", icon: <Users size={18} /> },
  { label: "Messagerie", href: "/institution/messages", icon: <MessageSquare size={18} /> },
  { label: "Recherche formateurs", href: "/recherche/formateurs", icon: <ArrowRight size={18} /> },
];

const RechercheFormateurs = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ competence: "", localisation: "" });
  const [sending, setSending] = useState(null);
  const [success, setSuccess] = useState("");

  const fetchFormateurs = async (filtres = {}) => {
    setLoading(true);
    try {
      const data = await formateurAPI.search(filtres);
      setFormateurs(data.formateurs || []);
    } catch (err) {
      console.error("Erreur formateurs :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFormateurs(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFormateurs(search);
  };

  const handleContact = async (formateur) => {
    setSending(formateur.id);
    try {
      await messageAPI.envoyer({
        destinataire_id: formateur.user_id,
        contenu: `Bonjour ${formateur.prenom || ""}, nous avons consulté votre profil et aimerions vous contacter pour une opportunité de formation.`,
      });
      setSuccess(`Message envoyé à ${formateur.prenom || formateur.email} !`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erreur contact :", err);
    } finally {
      setSending(null);
    }
  };

  return (
    <DashboardLayout navigation={NAVIGATION}>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Recherche de formateurs</h1>
        <p className="text-slate-500 text-sm mt-1">Trouvez le formateur idéal pour vos besoins</p>
      </div>

      {/* Succès */}
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
        <button type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all">
          Rechercher
        </button>
        {(search.competence || search.localisation) && (
          <button type="button"
            onClick={() => { setSearch({ competence: "", localisation: "" }); fetchFormateurs(); }}
            className="px-4 py-2.5 text-slate-500 hover:text-slate-700 text-sm border border-slate-200 rounded-lg transition-all">
            Réinitialiser
          </button>
        )}
      </form>

      {/* Résultats */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-400">Chargement...</p>
        </div>
      ) : formateurs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400">Aucun formateur trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formateurs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all">

              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold shrink-0">
                  {f.prenom?.charAt(0) || f.email?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">
                    {f.prenom && f.nom ? `${f.prenom} ${f.nom}` : f.email}
                  </p>
                  {f.localisation && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} /> {f.localisation}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`w-2 h-2 rounded-full ${f.disponible ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                    <span className="text-xs text-slate-500">
                      {f.disponible ? "Disponible" : "Non disponible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {f.bio && (
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{f.bio}</p>
              )}

              {/* Compétences */}
              {f.competences?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {f.competences.slice(0, 4).map((c) => <Badge key={c}>{c}</Badge>)}
                  {f.competences.length > 4 && (
                    <span className="text-xs text-slate-400 self-center">+{f.competences.length - 4}</span>
                  )}
                </div>
              )}

              {/* Actions */}
              <button
                onClick={() => handleContact(f)}
                disabled={sending === f.id || !f.disponible}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare size={14} />
                {sending === f.id ? "Envoi..." : "Contacter"}
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default RechercheFormateurs;