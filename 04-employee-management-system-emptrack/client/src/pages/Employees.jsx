import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const fetchEmployees = async () => {
    const params = { search, status: statusFilter, department: deptFilter, limit: 50 };
    const res = await api.get('/employees', { params });
    setEmployees(res.data.employees);
  };

  useEffect(() => { api.get('/departments').then((res) => setDepartments(res.data)); }, []);
  useEffect(() => {
    const t = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(t);
  }, [search, statusFilter, deptFilter]);

  const handleSave = async (data) => {
    if (editing) {
      const res = await api.patch(`/employees/${editing._id}`, data);
      setEmployees((prev) => prev.map((e) => (e._id === res.data._id ? res.data : e)));
    } else {
      const res = await api.post('/employees', data);
      setEmployees((prev) => [res.data, ...prev]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    await api.delete(`/employees/${toDelete._id}`);
    setEmployees((prev) => prev.filter((e) => e._id !== toDelete._id));
    setToDelete(null);
  };

  return (
    <div className="flex bg-canvas min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8 max-w-6xl">
        <Topbar title="Employees" subtitle="Manage employee records"
          action={
            <button onClick={() => { setEditing(null); setShowModal(true); }}
              className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-primary2 transition">
              <Plus size={18} /> Add Employee
            </button>
          } />

        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary transition bg-white"
              placeholder="Search by name, email, or position..." />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition bg-white">
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition bg-white">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        <EmployeeTable employees={employees} isAdmin={user?.role === 'admin'}
          onEdit={(emp) => { setEditing(emp); setShowModal(true); }}
          onDelete={(emp) => setToDelete(emp)} />
      </main>

      {showModal && (
        <EmployeeModal employee={editing} departments={departments}
          onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />
      )}
      {toDelete && (
        <ConfirmDialog title="Delete employee?" message={`This will permanently remove ${toDelete.name} from records.`}
          onConfirm={handleDelete} onCancel={() => setToDelete(null)} />
      )}
    </div>
  );
};

export default Employees;