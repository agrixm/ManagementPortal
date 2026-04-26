import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageWrapper from '../components/layout/PageWrapper';
import StatCard from '../components/ui/StatCard';
import { fetchProjects } from '../features/projects/projectSlice';
import { fetchTasks } from '../features/tasks/taskSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items);
  const tasks = useSelector((state) => state.tasks.items);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const doneTasks = tasks.filter((task) => task.status === 'done').length;

  return (
    <PageWrapper title="Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Total Tasks" value={tasks.length} />
        <StatCard label="Completed Tasks" value={doneTasks} />
      </div>
    </PageWrapper>
  );
}
