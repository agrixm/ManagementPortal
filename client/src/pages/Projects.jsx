import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageWrapper from '../components/layout/PageWrapper';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import { createProject, fetchProjects } from '../features/projects/projectSlice';

export default function Projects() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <PageWrapper title="Projects">
      <ProjectForm loading={loading} onSubmit={(payload) => dispatch(createProject(payload))} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </PageWrapper>
  );
}
