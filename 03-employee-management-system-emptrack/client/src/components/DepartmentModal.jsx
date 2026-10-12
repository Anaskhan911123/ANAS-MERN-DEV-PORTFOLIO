import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COLORS = ['#0d9488', '#f59e0b', '#6366f1', '#f472b6', '#22c55e', '#ef4444'];

const DepartmentModal = ({ dept, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (dept) { setName(dept.name); setDescription(dept.description || ''); setColor(dept.color); }
  }, [dept]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, description, color });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-ink text-lg font-bold">{dept ? 'Edit Department' : 'New Department'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Name</label>
            <input autoFocus required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition" placeholder="e.g. Engineering" />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition resize-none" />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-2 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button type="button" key={c} onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition ${color === c ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary2 transition">
            {dept ? 'Save Changes' : 'Create Department'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;