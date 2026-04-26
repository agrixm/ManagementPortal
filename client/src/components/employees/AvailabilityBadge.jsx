const styleMap = {
  free: 'bg-emerald-500/20 text-emerald-300',
  busy: 'bg-amber-500/20 text-amber-300',
  overloaded: 'bg-red-500/20 text-red-300'
};

export default function AvailabilityBadge({ value = 'free' }) {
  return (
    <span className={`rounded px-2 py-1 text-[11px] uppercase tracking-wide ${styleMap[value] || styleMap.free}`}>
      {value}
    </span>
  );
}
