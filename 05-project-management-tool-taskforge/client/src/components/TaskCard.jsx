import CategoryTag from './CategoryTag';

const priorityColors = { low: '#22C55E', medium: '#F59E0B', high: '#EF4444' };

const TaskCard = ({ task, onClick }) => {
  const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date();

  return (
    <div className="task-card" onClick={() => onClick(task)}>
      <div className="task-card-top">
        <span
          className="priority-dot"
          style={{ backgroundColor: priorityColors[task.priority] }}
          title={task.priority}
        />
        <h4>{task.title}</h4>
      </div>
      {task.description && <p className="task-card-desc">{task.description}</p>}
      <div className="task-card-footer">
        <CategoryTag name={task.category?.name} color={task.category?.color} />
        <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;