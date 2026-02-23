export default function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-panel p-4 shadow-lg shadow-black/20">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
