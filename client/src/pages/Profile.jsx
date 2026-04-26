import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import AvailabilityBadge from '../components/employees/AvailabilityBadge';
import api from '../services/api';
import { fetchMe } from '../features/auth/authSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        twitter: user.twitter || '',
        instagram: user.instagram || '',
        portfolio: user.portfolio || [],
        links: user.links || []
      });

      // fetch dashboard data
      (async () => {
        try {
          const userId = user._id || user.id;
          const { data } = await api.get(`/users/${userId}/dashboard`);
          setDashboard(data);
        } catch (err) {
          // ignore for now
        }
      })();
    }
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;
    const userId = user._id || user.id;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        name: form.name,
        avatar: form.avatar,
        bio: form.bio,
        twitter: form.twitter,
        instagram: form.instagram,
        portfolio: Array.isArray(form.portfolio) ? form.portfolio : [form.portfolio],
        links: Array.isArray(form.links) ? form.links : form.links || []
      };
      const { data } = await api.put(`/users/${userId}`, payload);
      // refresh current user info
      await dispatch(fetchMe());
      setSuccess('Profile saved');
      setEditing(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Unable to save profile';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <PageWrapper title="My Profile">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-lg border border-bx-border bg-bx-card p-5">
          <div className="flex items-center gap-4">
            <img src={user.avatar || '/avatar.png'} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
            <div>
              <h2 className="font-display text-lg text-bx-text">{user.name}</h2>
              <p className="text-sm text-bx-muted">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs uppercase text-bx-muted">{user.role}</span>
                <AvailabilityBadge value={user.availability || 'free'} />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-bx-text">{user.bio}</p>
            <div className="mt-3 text-sm text-bx-muted">
              {user.twitter && (
                <div>
                  <strong>Twitter:</strong> {user.twitter}
                </div>
              )}
              {user.instagram && (
                <div>
                  <strong>Instagram:</strong> {user.instagram}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button onClick={() => setEditing((s) => !s)} className="bx-btn">
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="col-span-2 rounded-lg border border-bx-border bg-bx-card p-5">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-3">
              {error && <div className="text-red-500">{error}</div>}
              {success && <div className="text-green-500">{success}</div>}
              <div>
                <label className="text-sm text-bx-muted">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full" />
              </div>
              <div>
                <label className="text-sm text-bx-muted">Avatar URL</label>
                <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="w-full" />
              </div>
              <div>
                <label className="text-sm text-bx-muted">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-bx-muted">Twitter</label>
                  <input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="text-sm text-bx-muted">Instagram</label>
                  <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full" />
                </div>
              </div>
              <div>
                <label className="text-sm text-bx-muted">Portfolio (comma separated URLs)</label>
                <input
                  value={(form.portfolio || []).join(',')}
                  onChange={(e) => setForm({ ...form, portfolio: e.target.value.split(',').map((s) => s.trim()) })}
                  className="w-full"
                />
              </div>

              <div>
                <button type="submit" className="bx-btn" disabled={loading}>
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h3 className="font-display text-lg text-bx-text">Dashboard</h3>
              <div className="mt-3">
                <h4 className="text-sm text-bx-muted">Assigned Tasks</h4>
                <p className="text-sm">{dashboard ? dashboard.assignedTasks.length : '—'}</p>
                <h4 className="mt-3 text-sm text-bx-muted">Tasks by status</h4>
                <ul className="mt-1 text-sm text-bx-text">
                  {dashboard &&
                    Object.entries(dashboard.tasksByStatus || {}).map(([k, v]) => (
                      <li key={k}>
                        {k}: {v}
                      </li>
                    ))}
                </ul>

                <h4 className="mt-3 text-sm text-bx-muted">Projects</h4>
                <p className="text-sm">Total involved: {dashboard ? dashboard.projects.length : '—'}</p>

                <h4 className="mt-3 text-sm text-bx-muted">Notifications</h4>
                <ul className="mt-1 text-sm">
                  {(dashboard && dashboard.notifications.length > 0 &&
                    dashboard.notifications.map((n, idx) => (
                      <li key={idx} className={`${n.read ? 'text-bx-muted' : 'text-bx-text'}`}>
                        {n.message}
                      </li>
                    ))) || <li className="text-sm text-bx-muted">No notifications</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
