import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import Button from '../ui/Button';

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-bx-border bg-bx-surface px-4 md:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-bx-muted">BlockX AI Limited</p>
        <p className="font-display text-lg text-bx-text">Employee Portal</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-sm font-medium text-bx-text">{user?.name}</p>
          <p className="text-xs text-bx-muted">{user?.role}</p>
        </div>
        <Button onClick={() => dispatch(logout())} className="bg-transparent ring-1 ring-bx-border hover:bg-bx-red-dim">
          Logout
        </Button>
      </div>
    </header>
  );
}
