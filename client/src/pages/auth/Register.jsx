import { useState } from "react";
import { GraduationCap, Eye, EyeOff, Building2, User } from "lucide-react";
import { authAPI } from "../../api/api";

const ROLES = [
  {
    value: "formateur",
    label: "Formateur",
    desc: "Je propose mes compétences et formations",
    icon: <User size={22} className="text-blue-600" />,
    bg: "bg-blue-50 border-blue-200",
    selected: "bg-blue-50 border-blue-500 ring-2 ring-blue-100",
  },
  {
    value: "institution",
    label: "Institution",
    desc: "Je recherche des formateurs qualifiés",
    icon: <Building2 size={22} className="text-violet-600" />,
    bg: "bg-violet-50 border-violet-200",
    selected: "bg-violet-50 border-violet-500 ring-2 ring-violet-100",
  },
];

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) return setError("Veuillez choisir un rôle");
    setLoading(true);
    try {
      await authAPI.register(form);
      setSuccess(true);
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Succès
  if (success) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Inscription réussie !</h2>
        <p className="text-slate-500 text-sm">Redirection vers la connexion...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 no-underline">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">Find Your Training</span>
          </a>
          <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-2">Créer un compte</h1>
          <p className="text-slate-500 text-sm">Rejoignez la plateforme gratuitement</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Choix du rôle */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Je suis...</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => { setForm({ ...form, role: r.value }); setError(""); }}
                    className={`p-4 rounded-xl border text-left transition-all duration-150 ${form.role === r.value ? r.selected : "border-slate-200 hover:border-slate-300 bg-white"}`}
                  >
                    <div className="mb-2">{r.icon}</div>
                    <p className="font-semibold text-slate-900 text-sm">{r.label}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                required
                className="px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-400">Minimum 6 caractères</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Inscription en cours..." : "Créer mon compte"}
            </button>
          </form>
        </div>

        {/* Lien login */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Déjà un compte ?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;