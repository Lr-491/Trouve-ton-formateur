import { Star, MapPin, ArrowRight } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

const FORMATEURS = [
  { initiales: "JD", nom: "Jean Dupont", ville: "Brazzaville", tags: ["React", "Node.js"], note: 4.8, avis: 12, bg: "bg-blue-50", color: "text-blue-600" },
  { initiales: "MK", nom: "Marie Kouassi", ville: "Pointe-Noire", tags: ["Python", "Data"], note: 4.9, avis: 8, bg: "bg-emerald-50", color: "text-emerald-600" },
  { initiales: "AB", nom: "Alain Bakala", ville: "Brazzaville", tags: ["UI/UX", "Figma"], note: 4.7, avis: 15, bg: "bg-violet-50", color: "text-violet-600" },
];

const BADGE_VARIANTS = ["blue", "green", "purple"];

const FormateursVedette = () => (
  <section className="py-20 px-6 bg-slate-50 border-y border-slate-200">
    <div className="max-w-4xl mx-auto">

      <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
        Formateurs
      </p>

      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Formateurs en vedette</h2>
        <a href="/recherche/formateurs" className="text-sm text-blue-600 font-medium flex items-center gap-1 no-underline hover:underline">
          Voir tous <ArrowRight size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FORMATEURS.map((f, i) => (
          <Card key={i} hover className="text-center">

            {/* Avatar */}
            <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold`}>
              {f.initiales}
            </div>

            {/* Infos */}
            <p className="font-semibold text-slate-900 mb-1">{f.nom}</p>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-4">
              <MapPin size={11} /> {f.ville}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {f.tags.map((t) => <Badge key={t} variant={BADGE_VARIANTS[i]}>{t}</Badge>)}
            </div>

            {/* Note */}
            <div className="flex items-center justify-center gap-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-slate-900">{f.note}</span>
              <span className="text-xs text-slate-400">({f.avis} avis)</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default FormateursVedette;