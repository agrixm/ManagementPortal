import AvailabilityBadge from './AvailabilityBadge';

export default function EmployeeCard({ employee }) {
  return (
    <article className="rounded-lg border border-bx-border bg-bx-card p-4">
      <h3 className="font-display text-lg text-bx-text">{employee.name}</h3>
      <p className="text-sm text-bx-muted">{employee.email}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs uppercase text-bx-muted">{employee.role}</span>
        <AvailabilityBadge value={employee.availability} />
      </div>
    </article>
  );
}
