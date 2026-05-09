import { ArrowRight, Sparkles } from "lucide-react";
import Button from "../ui/Button";

const Hero = () => (
  <section className="py-24 px-6 text-center max-w-4xl mx-auto">

    {/* Badge */}
    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full border border-blue-100 mb-8">
      <Sparkles size={14} />
      La plateforme de mise en relation #1
    </div>

    {/* Titre */}
    <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
      Trouvez le formateur idéal <br />
      <span className="text-blue-600">pour votre institution</span>
    </h1>

    {/* Description */}
    <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
      Connectez institutions éducatives et formateurs qualifiés.
      Publiez des offres, candidatez et collaborez en toute simplicité.
    </p>

    {/* Boutons */}
    <div className="flex flex-wrap gap-4 justify-center">
      <Button href="/register?role=institution" variant="primary" size="lg">
        Je suis une institution <ArrowRight size={16} />
      </Button>
      <Button href="/register?role=formateur" variant="outline" size="lg">
        Je suis formateur <ArrowRight size={16} />
      </Button>
    </div>
  </section>
);

export default Hero;