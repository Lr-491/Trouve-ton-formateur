import { useState, useEffect } from "react";
import { FileText, Users, MessageSquare, Plus, ArrowRight, Clock, Building2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { offreAPI, candidatureAPI, messageAPI } from "../../api/api";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/institution", icon: <Building2 size={18} /> },
  { label: "Mon profil", href: "/profil/institution", icon: <Building2 size={18} /> },
  { label: "Mes offres", href: "/institution/offres", icon: <FileText size={18} /> },
  { label: "Candidatures reçues", href: "/institution/candidatures", icon: <Users size={18} /> },
  { label: "Messagerie", href: "/institution/messages", icon: <MessageSquare size={18} /> },
  { label: "Recherche formateurs", href: "/recherche/formateurs", icon: <ArrowRight size={18} /> },
];

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  </div>
);

const StatutBadge = ({ statut }) => {
  const styles = {
    en_attente: "bg-amber-50 text-amber-700",
    acceptée: "bg-emerald-50 text-emerald-700",
    refusée: "bg-red-50 text-red-600",
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

const DashboardInstitution = () => {
  const { user } = useAuth();
  const [offres, setOffres] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [o, m] = await Promise.all([
          offreAPI.getAll(),
          messageAPI.getConversations(),
        ]);
        setOffres(o.offres || []);
        setConversations(m.conversations || []);
      } catch (err) {
        console.error("Erreur dashboard institution :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <h1 className="text-2xl font-bold text-slate-900">Bonjour 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Voici un résumé de votre activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Offres publiées"
          value={offres.length}
          icon={<FileText size={22} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          label="Candidatures reçues"
          value={candidatures.length}
          icon={<Users size={22} className="text-violet-600" />}
          color="bg-violet-50"
        />
        <StatCard
          label="Conversations actives"
          value={conversations.length}
          icon={<MessageSquare size={22} className="text-emerald-600" />}
          color="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Offres récentes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Mes offres récentes</h2>
            <a href="/institution/offres" className="text-xs text-blue-600 hover:underline no-underline flex items-center gap-1">
              Voir tout <ArrowRight size={12} />
            </a>
          </div>

          {offres.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm mb-3">Aucune offre publiée</p>
              <a href="/institution/offres"
                className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg no-underline font-medium transition-all"
              >
                <Plus size={14} /> Publier une offre
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {offres.slice(0, 4).map((o, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{o.titre}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={11} />
                      {new Date(o.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    o.statut === "ouverte" ? "bg-emerald-50 text-emerald-700" :
                    o.statut === "fermée" ? "bg-red-50 text-red-600" :
                    "bg-slate-100 text-slate-600"
                  }`}>{o.statut}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Candidatures récentes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Candidatures récentes</h2>
            <a href="/institution/candidatures" className="text-xs text-blue-600 hover:underline no-underline flex items-center gap-1">
              Voir tout <ArrowRight size={12} />
            </a>
          </div>

          {candidatures.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">Aucune candidature reçue pour le moment</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {candidatures.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {c.prenom} {c.nom}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.offre_titre}</p>
                  </div>
                  <StatutBadge statut={c.statut} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardInstitution;