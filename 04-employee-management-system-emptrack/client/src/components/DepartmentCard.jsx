import { Users, Pencil, Trash2 } from 'lucide-react';

const DepartmentCard = ({ dept, isAdmin, onEdit, onDelete }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${dept.color}1a` }}>
        <Users size={18} style={{ color: dept.color }} />
      </div>
      {isAdmin && (
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(dept)} className="text-gray-400 hover:text-primary transition"><Pencil size={15} /></button>
          <button onClick={() => onDelete(dept)} className="text-gray-400 hover:text-rose-500 transition"><Trash2 size={15} /></button>
        </div>
      )}
    </div>
    <h3 className="text-ink font-bold mb-1">{dept.name}</h3>
    <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{dept.description || 'No description'}</p>
    <span className="text-xs font-semibold text-gray-400">{dept.employeeCount} employee{dept.employeeCount === 1 ? '' : 's'}</span>
  </div>
);

export default DepartmentCard;