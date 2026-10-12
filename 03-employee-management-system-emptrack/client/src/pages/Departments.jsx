import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DepartmentCard from '../components/DepartmentCard';
import DepartmentModal from '../components/DepartmentModal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Departments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchDepartments = () => api.get('/departments').then((res) => setDepartments(res.data));
  useEffect(() => { fetchDepartments(); }, []);

  const handleSave = async (data) => {
    if (editing) {
      await api.patch(`/departments/${editing._id}`, data);
    } else {
      await api.post('/departments', data);
    }
    setShowModal(false);
    setEditing(null);
    fetchDepartments();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/departments/${toDelete._id}`);
      setToDelete(null);
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete department');
      setToDelete(null);
    }
  };

  return (
    <div className="flex bg-canvas min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8 max-w-6xl">
        <Topbar title="Departments" subtitle="Organizational structure"
          action={
            user?.role === 'admin' && (
              <button onClick={() => { setEditing(null); setShowModal(true); }}
                className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-primary2 transition">
                <Plus size={18} /> New Department
              </button>
            )
          } />

        {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg p-3 mb-5">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((d) => (
            <DepartmentCard key={d._id} dept={d} isAdmin={user?.role === 'admin'}
              onEdit={(dept) => { setEditing(dept); setShowModal(true); }} onDelete={(dept) => setToDelete(dept)} />
          ))}
        </div>
      </main>

      {showModal && (
        <DepartmentModal dept={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />
      )}
      {toDelete && (
        <ConfirmDialog title="Delete department?" message={`Remove "${toDelete.name}"? This can't be undone.`}
          onConfirm={handleDelete} onCancel={() => setToDelete(null)} />
      )}
    </div>
  );
};

export default Departments;