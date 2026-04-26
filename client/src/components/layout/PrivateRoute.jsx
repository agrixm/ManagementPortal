import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasRole } from '../../utils/roleGuard';

export default function PrivateRoute({ children, roles = [] }) {
  const { user, accessToken } = useSelector((state) => state.auth);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(user, roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
