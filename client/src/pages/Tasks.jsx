import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageWrapper from '../components/layout/PageWrapper';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { createTask, fetchTasks, patchTaskStatus } from '../features/tasks/taskSlice';
import { fetchProjects } from '../features/projects/projectSlice';
import Button from '../components/ui/Button';

export default function Tasks() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);
  const projects = useSelector((state) => state.projects.items);
  const [form, setForm] = useState({ title: '', projectId: '', priority: 'medium' });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  const projectOptions = useMemo(() => projects || [], [projects]);

  const submitTask = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.projectId) return;

    dispatch(createTask(form));
    setForm({ title: '', projectId: form.projectId, priority: 'medium' });
  };

  return (
    <PageWrapper title="Tasks">
      <form onSubmit={submitTask} className="grid gap-3 rounded-lg border border-bx-border bg-bx-card p-4 md:grid-cols-[2fr,1fr,1fr,auto]">
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Task title"
          className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
        />
        <select
          value={form.projectId}
          onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value }))}
          className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
        >
          <option value="">Select project</option>
          {projectOptions.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
        <select
          value={form.priority}
          onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
          className="rounded-md border border-bx-border bg-bx-surface px-3 py-2 text-sm text-bx-text outline-none focus:border-bx-red"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button type="submit">Add Task</Button>
      </form>

      <KanbanBoard tasks={tasks} onStatusChange={(taskId, status) => dispatch(patchTaskStatus({ taskId, status }))} />
    </PageWrapper>
  );
}
