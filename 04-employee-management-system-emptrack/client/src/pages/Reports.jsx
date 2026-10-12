import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import api from '../api/axios';

const Reports = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => { api.get('/reports/summary').then((res) => setSummary(res.data)); }, []);

  const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

  return (
    <div className="flex bg-canvas min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8 max-w-6xl">
        <Topbar title="Reports" subtitle="Department-wise breakdown and payroll" />

        {summary && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-[#e7ebe5]">
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Employees</th>
                  <th className="px-5 py-3 font-semibold">Share of Total</th>
                  <th className="px-5 py-3 font-semibold text-right">Total Salary</th>
                </tr>
              </thead>
              <tbody>
                {summary.byDepartment.map((d) => (
                  <tr key={d.name} className="border-b border-[#f0f2ee] last:border-0">
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-ink font-medium">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /> {d.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{d.count}</td>
                    <td className="px-5 py-3 text-gray-600">{((d.count / summary.total) * 100).toFixed(1)}%</td>
                    <td className="px-5 py-3 text-right text-ink font-semibold">Rs {fmt(d.totalSalary)}</td>
                  </tr>
                ))}
                {summary.byDepartment.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">No data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;