import TaskCard from './TaskCard';

const KanbanColumn = ({ title, status, tasks, onTaskClick, onDrop }) => {
  const columnTasks = tasks.filter((t) => t.status === status);

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData('taskId');
    onDrop(taskId, status);
  };

  return (
    <div className="kanban-column" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="kanban-column-header">
        <h3>{title}</h3>
        <span className="kanban-count">{columnTasks.length}</span>
      </div>
      <div className="kanban-column-body">
        {columnTasks.map((task) => (
          <div
            key={task._id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task._id)}
          >
            <TaskCard task={task} onClick={onTaskClick} />
          </div>
        ))}
        {columnTasks.length === 0 && <p className="kanban-empty">No tasks</p>}
      </div>
    </div>
  );
};

export default KanbanColumn;