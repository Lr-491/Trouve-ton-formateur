const VARIANTS = {
  blue:   "bg-blue-50 text-blue-700",
  green:  "bg-emerald-50 text-emerald-700",
  yellow: "bg-amber-50 text-amber-700",
  purple: "bg-violet-50 text-violet-700",
  gray:   "bg-slate-100 text-slate-600",
  red:    "bg-red-50 text-red-600",
};

const Badge = ({ children, variant = "blue", className = "" }) => (
  <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${VARIANTS[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;