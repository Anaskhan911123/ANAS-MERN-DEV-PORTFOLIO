import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EmployeeModal = ({ employee, departments, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', position: '', department: departments[0]?._id || '',
    salary: '', status: 'active', joinDate: '',
  });

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name, email: employee.email, phone: employee.phone || '',
        position: employee.position, department: employee.department?._id || '',
        salary: employee.salary || '', status: employee.status,
        joinDate: employee.joinDate ? employee.joinDate.substring(0, 10) : '',
      });
    }
  }, [employee]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.position.trim() || !form.department) return;
    onSave({ ...form, salary: Number(form.salary) || 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="card w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-ink text-lg font-bold">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Full name</label>
              <input required value={form.name} onChange={set('name')}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Email</label>
              <input type="email" required value={form.email} onChange={set('email')}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Phone</label>
              <input value={form.phone} onChange={set('phone')}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Position</label>
              <input required value={form.position} onChange={set('position')}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Department</label>
              <select required value={form.department} onChange={set('department')}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition">
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Salary</label>
              <input type="number" min="0" value={form.salary} onChange={set('salary')}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Status</label>
              <select value={form.status} onChange={set('status')}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition">
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Join date</label>
              <input type="date" value={form.joinDate} onChange={set('joinDate')}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition" />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary2 transition">
            {employee ? 'Save Changes' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;