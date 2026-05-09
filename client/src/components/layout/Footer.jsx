import { GraduationCap } from "lucide-react";

const LINKS = ["À propos", "Contact", "CGU", "Confidentialité"];

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
    <div className="max-w-6xl mx-auto px-8 py-10 flex flex-wrap items-center justify-between gap-6">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <GraduationCap size={17} className="text-white" />
        </div>
        <span className="font-bold text-base text-white">Find Your Training</span>
      </div>

      {/* Copyright */}
      <p className="text-sm">© 2026 Find Your Training. Tous droits réservés.</p>

      {/* Liens */}
      <div className="flex gap-6">
        {LINKS.map((l) => (
          <a key={l} href="#"
            className="text-sm text-slate-400 hover:text-white transition-colors duration-150 no-underline"
          >{l}</a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;