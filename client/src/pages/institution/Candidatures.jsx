import { useState, useEffect } from "react";
import { Check, X, ChevronDown, ChevronUp, Building2, FileText, Users, MessageSquare, ArrowRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { offreAPI, candidatureAPI } from "../../api/api";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/institution", icon: <Building2 size={18} /> },
  { label: "Mon profil", href: "/profil/institution", icon: <Building2 size={18} /> },
  { label: "Mes offres", href: "/institution/offres", icon: <FileText size={18} /> },
  { label: "Candidatures reçues", href: "/institution/candidatures", icon: <Users size={18} /> },
  { label: "Messagerie", href: "/institution/messages", icon: <MessageSquare size={18} /> },
  { label: "Recherche formateurs", href: "/recherche/formateurs", icon: <ArrowRight size={18} /> },
];

const StatutBadge = ({ statut }) => {
  const styles = {
    en_attente: "bg-amber-50 text-amber-700 border border-amber-200",
    acceptée: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    refusée: "bg-red-50 text-red-600 border border-red-200",
  };
  const labels = { en_attente: "En attente", acceptée: "Acceptée", refusée: "Refusée" };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[statut] || "bg-slate-100 text-slate-600"}`}>
      {labels[statut] || statut}
    </span>
  );
};

const CandidaturesInstitution = () => {
  const [offres, setOffres] = useState([]);
  const [candidatures, setCandidatures] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const data = await offreAPI.getAll();
        setOffres(data.offres || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffres();
  }, []);

  const fetchCandidatures = async (offre_id) => {
    if (candidatures[offre_id]) return;
    try {
      const data = await candidatureAPI.getCandidaturesOffre(offre_id);
      setCandidatures({ ...candidatures, [offre_id]: data.candidatures || [] });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleOffre = (offre_id) => {
    if (expanded === offre_id) {
      setExpanded(null);
    } else {
      setExpanded(offre_id);
      fetchCandidatures(offre_id);
    }
  };

  const updateStatut = async (candidature_id, statut, offre_id) => {
    try {
      await candidatureAPI.updateStatut(candidature_id, { statut });
      setCandidatures({
        ...candidatures,
        [offre_id]: candidatures[offre_id].map((c) =>
          c.id === candidature_id ? { ...c, statut } : c
        ),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout navigation={NAVIGATION}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Candidatures reçues</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez les candidatures par offre</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-400">Chargement...</p>
        </div>
      ) : offres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400">Aucune offre publiée</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {offres.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Header offre */}
              <button
                onClick={() => toggleOffre(o.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all text-left"
              >
                <div>
                  <p className="font-semibold text-slate-900">{o.titre}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{o.localisation}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    o.statut === "ouverte" ? "bg-emerald-50 text-emerald-700" :
                    o.statut === "fermée" ? "bg-red-50 text-red-600" :
                    "bg-slate-100 text-slate-600"
                  }`}>{o.statut}</span>
                  {expanded === o.id ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </div>
              </button>

              {/* Candidatures */}
              {expanded === o.id && (
                <div className="border-t border-slate-100 px-5 py-4">
                  {!candidatures[o.id] ? (
                    <p className="text-slate-400 text-sm text-center py-4">Chargement...</p>
                  ) : candidatures[o.id].length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">Aucune candidature pour cette offre</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {candidatures[o.id].map((c) => (
                        <div key={c.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                                {c.prenom?.charAt(0) || c.email?.charAt(0) || "?"}
                              </div>
                              <p className="font-medium text-slate-900 text-sm">
                                {c.prenom} {c.nom}
                              </p>
                              <StatutBadge statut={c.statut} />
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{c.email}</p>
                            {c.message && (
                              <p className="text-sm text-slate-600 line-clamp-2 bg-white rounded-lg px-3 py-2 border border-slate-100">
                                {c.message}
                              </p>
                            )}
                            {c.competences?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {c.competences.map((comp) => (
                                  <span key={comp} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{comp}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          {c.statut === "en_attente" && (
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => updateStatut(c.id, "acceptée", o.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-all"
                              >
                                <Check size={13} /> Accepter
                              </button>
                              <button
                                onClick={() => updateStatut(c.id, "refusée", o.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-all"
                              >
                                <X size={13} /> Refuser
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CandidaturesInstitution;