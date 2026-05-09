import { MapPin, ArrowRight } from "lucide-react";
import Badge from "../ui/Badge";

const OFFRES = [
  {
    titre: "Formateur en développement web",
    institution: "Institut Supérieur du Congo",
    ville: "Brazzaville",
    tags: ["React.js", "Node.js"],
  },
  {
    titre: "Formateur en analyse de données",
    institution: "École Nationale des Sciences",
    ville: "Pointe-Noire",
    tags: ["Python", "Data Science"],
  },
  {
    titre: "Formateur en design d'interface",
    institution: "Centre de Formation Pro",
    ville: "Brazzaville",
    tags: ["UI/UX", "Figma"],
  },
];

const OffresRecentes = () => (
  <section className="py-20 px-6">
    <div className="max-w-4xl mx-auto">

      <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
        Offres récentes
      </p>

      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Dernières opportunités</h2>
        <a href="/recherche/offres" className="text-sm text-blue-600 font-medium hover:underline no-underline flex items-center gap-1">
          Voir toutes <ArrowRight size={14} />
        </a>
      </div>

      <div className="flex flex-col gap-4">
        {OFFRES.map((o, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 hover:border-blue-200 hover:shadow-md transition-all duration-150">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {o.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                <Badge variant="green">Ouverte</Badge>
              </div>
              <p className="font-semibold text-slate-900 mb-1">{o.titre}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <MapPin size={13} /> {o.institution} · {o.ville}
              </p>
            </div>
            <a href="/recherche/offres"
              className="text-sm font-medium text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-all no-underline whitespace-nowrap"
            >
              Voir l'offre
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OffresRecentes;