import { useSelector } from 'react-redux';

export default function useAuth() {
  const auth = useSelector((state) => state.auth);
  return {
    user: auth.user,
    accessToken: auth.accessToken,
    isAuthenticated: Boolean(auth.accessToken && auth.user)
  };
}
