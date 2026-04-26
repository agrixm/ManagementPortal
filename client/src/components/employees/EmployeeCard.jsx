import AvailabilityBadge from './AvailabilityBadge';
import { Link } from 'react-router-dom';

export default function EmployeeCard({ employee }) {
  return (
    <Link to={`/profile/${employee._id}`} className="no-underline">
      <article className="rounded-lg border border-bx-border bg-bx-card p-4 hover:shadow">
        <h3 className="font-display text-lg text-bx-text">{employee.name}</h3>
        <p className="text-sm text-bx-muted">{employee.email}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs uppercase text-bx-muted">{employee.role}</span>
          <AvailabilityBadge value={employee.availability} />
        </div>
      </article>
    </Link>
  );
}
