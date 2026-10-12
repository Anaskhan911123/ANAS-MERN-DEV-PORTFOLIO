import { Pencil, Trash2 } from 'lucide-react';

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-600',
  'on-leave': 'bg-amber-50 text-amber-600',
  terminated: 'bg-rose-50 text-rose-600',
};

const EmployeeTable = ({ employees, isAdmin, onEdit, onDelete }) => (
  <div className="card overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-[#e7ebe5]">
          <th className="px-5 py-3 font-semibold">Employee</th>
          <th className="px-5 py-3 font-semibold">Department</th>
          <th className="px-5 py-3 font-semibold">Position</th>
          <th className="px-5 py-3 font-semibold">Status</th>
          <th className="px-5 py-3 font-semibold text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp._id} className="border-b border-[#f0f2ee] last:border-0 hover:bg-gray-50/60 transition">
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary2 flex items-center justify-center text-xs font-bold shrink-0">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-ink font-semibold truncate">{emp.name}</p>
                  <p className="text-gray-400 text-xs truncate">{emp.email}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-3">
              <span className="inline-flex items-center gap-1.5 text-gray-600">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: emp.department?.color }} />
                {emp.department?.name}
              </span>
            </td>
            <td className="px-5 py-3 text-gray-600">{emp.position}</td>
            <td className="px-5 py-3">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_STYLES[emp.status]}`}>
                {emp.status.replace('-', ' ')}
              </span>
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => onEdit(emp)} className="text-gray-400 hover:text-primary transition"><Pencil size={16} /></button>
                {isAdmin && (
                  <button onClick={() => onDelete(emp)} className="text-gray-400 hover:text-rose-500 transition"><Trash2 size={16} /></button>
                )}
              </div>
            </td>
          </tr>
        ))}
        {employees.length === 0 && (
          <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No employees found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

export default EmployeeTable;