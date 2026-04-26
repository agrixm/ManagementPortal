import { useSelector } from 'react-redux';
import PageWrapper from '../components/layout/PageWrapper';
import AvailabilityBadge from '../components/employees/AvailabilityBadge';

export default function Profile() {
  const user = useSelector((state) => state.auth.user);

  return (
    <PageWrapper title="My Profile">
      <div className="max-w-xl rounded-lg border border-bx-border bg-bx-card p-5">
        <h2 className="font-display text-xl text-bx-text">{user?.name}</h2>
        <p className="text-sm text-bx-muted">{user?.email}</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs uppercase text-bx-muted">{user?.role}</span>
          <AvailabilityBadge value={user?.availability || 'free'} />
        </div>
      </div>
    </PageWrapper>
  );
}
