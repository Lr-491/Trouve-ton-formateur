import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import HowItWorks from "../components/home/HowItWorks";
import OffresRecentes from "../components/home/OffresRecentes";
import FormateursVedette from "../components/home/FormateursVedette";
import Button from "../components/ui/Button";

const CTA = () => (
  <section className="py-24 px-6 text-center">
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold text-slate-900 mb-5">Prêt à commencer ?</h2>
      <p className="text-lg text-slate-500 leading-relaxed mb-10">
        Rejoignez la plateforme et trouvez les meilleures opportunités de formation en République du Congo.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button href="/register?role=institution" variant="primary" size="lg">
          Créer un compte institution
        </Button>
        <Button href="/register?role=formateur" variant="outline" size="lg">
          Créer un compte formateur
        </Button>
      </div>
    </div>
  </section>
);

const Home = () => (
  <div className="bg-slate-50 min-h-screen font-sans">
    <Navbar />
    <Hero />
    <Stats />
    <HowItWorks />
    <OffresRecentes />
    <FormateursVedette />
    <CTA />
    <Footer />
  </div>
);

export default Home;