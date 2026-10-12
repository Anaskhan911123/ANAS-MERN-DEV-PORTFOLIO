import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    const [tasksRes, catsRes] = await Promise.all([
      api.get('/tasks'),
      api.get('/categories'),
    ]);
    setTasks(tasksRes.data);
    setCategories(catsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNewTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const openEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleSave = async (form, taskId) => {
    if (taskId) {
      await api.put(`/tasks/${taskId}`, form);
    } else {
      await api.post('/tasks', form);
    }
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setShowModal(false);
    fetchData();
  };

  const handleDrop = async (taskId, newStatus) => {
    await api.put(`/tasks/${taskId}`, { status: newStatus });
    fetchData();
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Board</h1>
          <button className="btn-primary" onClick={openNewTask}>+ New Task</button>
        </div>
        <div className="kanban-board">
          <KanbanColumn title="To Do" status="todo" tasks={tasks} onTaskClick={openEditTask} onDrop={handleDrop} />
          <KanbanColumn title="In Progress" status="in-progress" tasks={tasks} onTaskClick={openEditTask} onDrop={handleDrop} />
          <KanbanColumn title="Done" status="done" tasks={tasks} onTaskClick={openEditTask} onDrop={handleDrop} />
        </div>
      </div>
      {showModal && (
        <TaskModal
          task={selectedTask}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Board;