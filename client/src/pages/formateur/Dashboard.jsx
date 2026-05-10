import { useState, useEffect } from "react";
import { FileText, BookOpen, MessageSquare, Star, Plus, ArrowRight, Clock } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { candidatureAPI, formationAPI, messageAPI } from "../../api/api";

// ─── Navigation sidebar formateur ────────────────────────────────────────────
const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/formateur", icon: <FileText size={18} /> },
  { label: "Mon profil", href: "/profil/formateur", icon: <Star size={18} /> },
  { label: "Mes candidatures", href: "/formateur/candidatures", icon: <FileText size={18} /> },
  { label: "Mes formations", href: "/formateur/formations", icon: <BookOpen size={18} /> },
  { label: "Messagerie", href: "/formateur/messages", icon: <MessageSquare size={18} /> },
  { label: "Offres disponibles", href: "/recherche/offres", icon: <ArrowRight size={18} /> },
];

// ─── Composant carte stat ─────────────────────────────────────────────────────
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

// ─── Badge statut candidature ─────────────────────────────────────────────────
const StatutBadge = ({ statut }) => {
  const styles = {
    en_attente: "bg-amber-50 text-amber-700",
    acceptée:   "bg-emerald-50 text-emerald-700",
    refusée:    "bg-red-50 text-red-600",
  };
  const labels = {
    en_attente: "En attente",
    acceptée:   "Acceptée",
    refusée:    "Refusée",
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[statut] || "bg-slate-100 text-slate-600"}`}>
      {labels[statut] || statut}
    </span>
  );
};

// ─── Dashboard Formateur ──────────────────────────────────────────────────────
const DashboardFormateur = () => {
  const { user } = useAuth();
  const [candidatures, setCandidatures] = useState([]);
  const [formations, setFormations] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, f, m] = await Promise.all([
          candidatureAPI.getMesCandidatures(),
          formationAPI.getAll(),
          messageAPI.getConversations(),
        ]);
        setCandidatures(c.candidatures || []);
        setFormations(f.formations || []);
        setConversations(m.conversations || []);
      } catch (err) {
        console.error("Erreur dashboard :", err);
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

      {/* Header page */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Bonjour 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Voici un résumé de votre activité
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Candidatures envoyées"
          value={candidatures.length}
          icon={<FileText size={22} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          label="Formations publiées"
          value={formations.length}
          icon={<BookOpen size={22} className="text-emerald-600" />}
          color="bg-emerald-50"
        />
        <StatCard
          label="Conversations actives"
          value={conversations.length}
          icon={<MessageSquare size={22} className="text-violet-600" />}
          color="bg-violet-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Candidatures récentes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Candidatures récentes</h2>
            <a href="/formateur/candidatures" className="text-xs text-blue-600 hover:underline no-underline flex items-center gap-1">
              Voir tout <ArrowRight size={12} />
            </a>
          </div>

          {candidatures.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm mb-3">Aucune candidature pour le moment</p>
              <a href="/recherche/offres" className="text-sm text-blue-600 font-medium hover:underline no-underline">
                Parcourir les offres →
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {candidatures.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{c.offre_titre}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={11} />
                      {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <StatutBadge statut={c.statut} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formations publiées */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Mes formations</h2>
            <a href="/formateur/formations" className="text-xs text-blue-600 hover:underline no-underline flex items-center gap-1">
              Voir tout <ArrowRight size={12} />
            </a>
          </div>

          {formations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm mb-3">Aucune formation publiée</p>
              <a href="/formateur/formations/new" className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg no-underline font-medium transition-all">
                <Plus size={14} /> Publier une formation
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {formations.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{f.titre}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{f.duree}h · {f.niveau}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                    {f.prix?.toLocaleString()} FCFA
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardFormateur;