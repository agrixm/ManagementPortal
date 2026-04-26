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
    <main
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        backgroundImage: "url('https://i.pinimg.com/1200x/e7/19/07/e71907be6d0d62ef58eadd99e91fe386.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <section className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/5 backdrop-blur-lg p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <img src="/logo.png" alt="BlockX logo" className="h-10 w-10 object-contain" />
          </div>
        
          <h1 className="mt-2 font-display text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-white/70">Sign in to continue to your portal</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Password"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-white/10 text-white">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">or</span>
            <div className="h-px flex-1 bg-white/20" />
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
            <p className="text-center text-xs text-white/60">
              Google auth not configured. Set VITE_GOOGLE_CLIENT_ID to enable it.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
