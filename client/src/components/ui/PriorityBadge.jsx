const styleMap = {
  high: 'bg-red-500/20 text-red-300',
  medium: 'bg-amber-500/20 text-amber-300',
  low: 'bg-emerald-500/20 text-emerald-300'
};

export default function PriorityBadge({ priority }) {
  const value = (priority || 'medium').toLowerCase();
  return (
    <span className={`rounded px-2 py-1 text-[11px] uppercase tracking-wide ${styleMap[value] || styleMap.medium}`}>
      {value}
    </span>
  );
}
