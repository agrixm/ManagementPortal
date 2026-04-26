export default function ProjectCard({ project }) {
  return (
    <article className="rounded-lg border border-bx-border bg-bx-card p-4">
      <div className="mb-2 h-0.5 w-16 bg-bx-red" />
      <h3 className="font-display text-xl text-bx-text">{project.name}</h3>
      <p className="mt-2 text-sm text-bx-muted">{project.description || 'No description'}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-bx-muted">
        <span>{project.members?.length || 0} members</span>
        <span className="uppercase">{project.status}</span>
      </div>
    </article>
  );
}
