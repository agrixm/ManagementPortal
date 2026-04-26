import { Draggable } from 'react-beautiful-dnd';
import PriorityBadge from '../ui/PriorityBadge';

export default function TaskCard({ task, index }) {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="rounded-md border border-bx-border bg-bx-surface p-3"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-bx-text">{task.title}</h4>
            <PriorityBadge priority={task.priority} />
          </div>
          <p className="text-xs text-bx-muted">{task.description || 'No description'}</p>
          {task.assignedTo?.name && <p className="mt-2 text-xs text-bx-muted">@ {task.assignedTo.name}</p>}
        </article>
      )}
    </Draggable>
  );
}
