import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PageWrapper from '../components/layout/PageWrapper';
import api from '../services/api';
import EmployeeCard from '../components/employees/EmployeeCard';

export default function Employees() {
  const currentUser = useSelector((s) => s.auth.user);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    availability: 'free',
    department: ''
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { data } = await api.get('/users');
        if (mounted) setEmployees(data);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || err.message || 'Unable to load employees');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);


  const submitEmployee = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        availability: form.availability,
        department: form.department.trim()
      };

      const { data } = await api.post('/users', payload);
      setEmployees((prev) => [data, ...prev]);
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        availability: 'free',
        department: ''
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to create employee');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper title="Employees">
      {currentUser?.role === 'admin' && (
        <form
          onSubmit={submitEmployee}
          className="mb-4 grid gap-3 rounded-lg border border-bx-border bg-bx-card p-4 md:grid-cols-3"
        >
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
        />
        <input
          required
          type="password"
          minLength={6}
          placeholder="Temporary password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
        />
        <select
          value={form.role}
          onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={form.availability}
          onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
          className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
        >
          <option value="free">Free</option>
          <option value="busy">Busy</option>
          <option value="overloaded">Overloaded</option>
        </select>
        <input
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
          className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
        />
        <button
          type="submit"
          disabled={saving}
          className="md:col-span-3 rounded-md bg-bx-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-bx-red-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Adding employee...' : 'Add employee'}
        </button>
          {error && <p className="md:col-span-3 text-sm text-red-400">{error}</p>}
        </form>
      )}

      {loading && <p className="text-sm text-bx-muted">Loading employees...</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => (
          <EmployeeCard key={employee._id} employee={employee} />
        ))}
      </div>
    </PageWrapper>
  );
}
