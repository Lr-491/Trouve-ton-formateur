import { useState, useEffect } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import Button from "../ui/Button";

const NAV_LINKS = [
  { label: "Formateurs", href: "/recherche/formateurs" },
  { label: "Offres", href: "/recherche/offres" },
  { label: "Formations", href: "/formations" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-shadow duration-200 ${scrolled ? "shadow-md" : ""}`}>
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900">Find Your Training</span>
        </a>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href}
              className="text-slate-500 text-sm font-medium px-4 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 no-underline"
            >{l.label}</a>
          ))}
        </div>

        {/* Boutons desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/login" className="text-sm font-medium text-slate-700 px-5 py-2 rounded-lg border border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-150 no-underline">
            Connexion
          </a>
          <a href="/register" className="text-sm font-medium text-white px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-150 no-underline shadow-sm">
            S'inscrire
          </a>
        </div>

        {/* Burger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden px-8 pb-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href}
              className="text-slate-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-50 no-underline"
            >{l.label}</a>
          ))}
          <div className="flex gap-3 mt-3">
            <a href="/login" className="text-sm font-medium text-slate-700 px-4 py-2 rounded-lg border border-slate-200 no-underline">
              Connexion
            </a>
            <a href="/register" className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-blue-600 no-underline">
              S'inscrire
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;