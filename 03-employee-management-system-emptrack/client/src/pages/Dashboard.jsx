import { useState, useEffect } from 'react';
import { Users, Building2, UserCheck, UserMinus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import api from '../api/axios';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/reports/summary').then((res) => setSummary(res.data));
  }, []);

  return (
    <div className="flex bg-canvas min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8 max-w-6xl">
        <Topbar title="Dashboard" subtitle="Overview of your workforce" />

        {summary && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Employees" value={summary.total} icon={Users} tint="#0d9488" />
              <StatCard label="Active" value={summary.active} icon={UserCheck} tint="#22c55e" />
              <StatCard label="On Leave" value={summary.onLeave} icon={UserMinus} tint="#f59e0b" />
              <StatCard label="Departments" value={summary.departmentCount} icon={Building2} tint="#6366f1" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="card p-5">
                <h3 className="text-ink font-bold mb-4">Headcount by Department</h3>
                <div className="space-y-3">
                  {summary.byDepartment.map((d) => (
                    <div key={d.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 font-medium">{d.name}</span>
                        <span className="text-gray-400">{d.count}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(d.count / summary.total) * 100}%`, backgroundColor: d.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="text-ink font-bold mb-4">Recent Hires</h3>
                <div className="space-y-3">
                  {summary.recentHires.map((emp) => (
                    <div key={emp._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary2 flex items-center justify-center text-xs font-bold shrink-0">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-ink text-sm font-semibold truncate">{emp.name}</p>
                        <p className="text-gray-400 text-xs truncate">{emp.position} · {emp.department?.name}</p>
                      </div>
                    </div>
                  ))}
                  {summary.recentHires.length === 0 && <p className="text-gray-400 text-sm">No employees yet</p>}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;