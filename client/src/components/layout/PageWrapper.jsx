export default function PageWrapper({ title, children, actions }) {
  return (
    <section className="space-y-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-wide text-bx-text">{title}</h1>
        {actions}
      </div>
      {children}
    </section>
  );
}
