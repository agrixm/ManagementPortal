import { DragDropContext } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

export default function KanbanBoard({ tasks, onStatusChange }) {
  const grouped = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {});

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId) return;

    onStatusChange(result.draggableId, result.destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            droppableId={column.id}
            items={grouped[column.id] || []}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
