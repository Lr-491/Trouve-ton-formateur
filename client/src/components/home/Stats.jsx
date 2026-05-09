const STATS = [
  { value: "120+", label: "Formateurs inscrits", color: "text-blue-600" },
  { value: "85+",  label: "Institutions partenaires", color: "text-emerald-600" },
  { value: "340+", label: "Offres publiées", color: "text-amber-500" },
];

const Stats = () => (
  <section className="px-6 pb-20">
    <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
      {STATS.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-7 text-center shadow-sm">
          <p className={`text-4xl font-bold mb-2 ${s.color}`}>{s.value}</p>
          <p className="text-sm text-slate-500 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Stats;