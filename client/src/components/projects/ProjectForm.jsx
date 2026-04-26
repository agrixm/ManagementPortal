import { useState } from 'react';
import Button from '../ui/Button';

export default function ProjectForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: '', description: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    setForm({ name: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border border-bx-border bg-bx-card p-4 md:grid-cols-[1fr,2fr,auto]">
      <input
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        placeholder="Project name"
        className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
      />
      <input
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        placeholder="Description"
        className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
      />
      <Button disabled={loading} type="submit">Create</Button>
    </form>
  );
}
