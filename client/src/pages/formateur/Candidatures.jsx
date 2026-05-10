import { useState, useEffect } from "react";
import { ArrowRight, Clock, FileText, BookOpen, MessageSquare, Star } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { candidatureAPI } from "../../api/api";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/formateur", icon: <FileText size={18} /> },
  { label: "Mon profil", href: "/profil/formateur", icon: <Star size={18} /> },
  { label: "Mes candidatures", href: "/formateur/candidatures", icon: <FileText size={18} /> },
  { label: "Mes formations", href: "/formateur/formations", icon: <BookOpen size={18} /> },
  { label: "Messagerie", href: "/formateur/messages", icon: <MessageSquare size={18} /> },
  { label: "Offres disponibles", href: "/recherche/offres", icon: <ArrowRight size={18} /> },
];

const STATUTS = {
  tous: "Tous",
  en_attente: "En attente",
  acceptée: "Acceptée",
  refusée: "Refusée",
};

const StatutBadge = ({ statut }) => {
  const styles = {
    en_attente: "bg-amber-50 text-amber-700 border border-amber-200",
    acceptée: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    refusée: "bg-red-50 text-red-600 border border-red-200",
  };
  const labels = {
    en_attente: "En attente",
    acceptée: "Acceptée",
    refusée: "Refusée",
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[statut] || "bg-slate-100 text-slate-600"}`}>
      {labels[statut] || statut}
    </span>
  );
};

const Candidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [filtre, setFiltre] = useState("tous");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await candidatureAPI.getMesCandidatures();
        setCandidatures(data.candidatures || []);
      } catch (err) {
        console.error("Erreur candidatures :", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtrees = filtre === "tous"
    ? candidatures
    : candidatures.filter((c) => c.statut === filtre);

  return (
    <DashboardLayout navigation={NAVIGATION}>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mes candidatures</h1>
        <p className="text-slate-500 text-sm mt-1">
          Suivez l'état de toutes vos candidatures
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(STATUTS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFiltre(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filtre === key
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
            }`}
          >
            {label}
            <span className="ml-2 text-xs opacity-70">
              {key === "tous"
                ? candidatures.length
                : candidatures.filter((c) => c.statut === key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-400">Chargement...</p>
        </div>
      ) : filtrees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 mb-4">Aucune candidature trouvée</p>
          <a href="/recherche/offres"
            className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg no-underline font-medium transition-all"
          >
            Parcourir les offres <ArrowRight size={14} />
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtrees.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">

                  {/* Titre offre */}
                  <p className="font-semibold text-slate-900 mb-1">{c.offre_titre}</p>

                  {/* Institution */}
                  <p className="text-sm text-slate-500 mb-3">{c.institution_nom}</p>

                  {/* Message */}
                  {c.message && (
                    <div className="bg-slate-50 rounded-lg px-4 py-3 mb-3">
                      <p className="text-xs text-slate-400 mb-1">Votre message :</p>
                      <p className="text-sm text-slate-600 line-clamp-2">{c.message}</p>
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={11} />
                    Postulé le {new Date(c.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>

                <StatutBadge statut={c.statut} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Candidatures;