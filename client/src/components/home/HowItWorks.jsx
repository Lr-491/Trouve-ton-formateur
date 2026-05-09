import { UserPlus, Search, Handshake } from "lucide-react";
import Card from "../ui/Card";

const STEPS = [
  {
    icon: <UserPlus size={26} className="text-blue-600" />,
    bg: "bg-blue-50",
    title: "Créez votre profil",
    desc: "Inscrivez-vous en tant que formateur ou institution en quelques minutes.",
  },
  {
    icon: <Search size={26} className="text-emerald-600" />,
    bg: "bg-emerald-50",
    title: "Trouvez ou publiez",
    desc: "Recherchez des formateurs qualifiés ou publiez vos offres de mission.",
  },
  {
    icon: <Handshake size={26} className="text-amber-500" />,
    bg: "bg-amber-50",
    title: "Collaborez",
    desc: "Échangez via la messagerie et lancez vos formations sereinement.",
  },
];

const HowItWorks = () => (
  <section className="py-20 px-6 bg-white border-y border-slate-200">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest text-center mb-3">
        Comment ça marche
      </p>
      <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
        Simple, rapide et efficace
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((s, i) => (
          <Card key={i} hover className="text-center">
            <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
              {s.icon}
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-3">{s.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;