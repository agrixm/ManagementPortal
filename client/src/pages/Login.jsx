import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, loginWithGoogle } from '../features/auth/authSlice';
import Button from '../components/ui/Button';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, accessToken } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (user && accessToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, accessToken, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    const action = await dispatch(
      login({
        email: form.email.trim(),
        password: form.password
      })
    );
    if (login.fulfilled.match(action)) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bx-bg px-4">
      <section className="w-full max-w-md rounded-xl border border-bx-border bg-bx-card p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-bx-muted">BlockX AI Limited</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-bx-text">Portal Login</h1>
        <p className="mt-2 text-sm text-bx-muted">Use your employee credentials to continue.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
            placeholder="Password"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-bx-border" />
            <span className="text-xs uppercase tracking-[0.2em] text-bx-muted">or</span>
            <div className="h-px flex-1 bg-bx-border" />
          </div>

          {googleClientId ? (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (response) => {
                  if (!response.credential) return;
                  const action = await dispatch(loginWithGoogle({ credential: response.credential }));
                  if (loginWithGoogle.fulfilled.match(action)) {
                    navigate('/dashboard', { replace: true });
                  }
                }}
                onError={() => {
                  // Keep UX simple: server error text is shown from rejected thunk path.
                }}
                theme="filled_black"
                text="continue_with"
                shape="pill"
                width="320"
              />
            </div>
          ) : (
            <p className="text-center text-xs text-bx-muted">
              Google auth not configured. Set VITE_GOOGLE_CLIENT_ID to enable it.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
