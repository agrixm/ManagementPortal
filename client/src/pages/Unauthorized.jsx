import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <main className="grid min-h-screen place-items-center bg-bx-bg p-6 text-center">
      <section className="max-w-md rounded-lg border border-bx-border bg-bx-card p-6">
        <h1 className="font-display text-3xl text-bx-text">Unauthorized</h1>
        <p className="mt-2 text-sm text-bx-muted">Your role does not allow access to this page.</p>
        <Link to="/dashboard" className="mt-4 inline-block text-sm text-bx-red hover:text-bx-red-hover">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
