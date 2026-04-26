export default function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-bx-border bg-bx-card p-4">
      <p className="text-xs text-bx-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-bx-text">{value}</p>
    </div>
  );
}
