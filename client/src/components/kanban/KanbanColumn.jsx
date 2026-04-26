import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

export default function KanbanColumn({ title, droppableId, items }) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="min-h-[300px] rounded-lg border border-bx-border bg-bx-card p-3"
        >
          <h3 className="mb-3 font-display text-lg text-bx-text">{title}</h3>
          <div className="space-y-2">
            {items.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </section>
      )}
    </Droppable>
  );
}
