import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import api from '../api/axios';
import PageHeader from '../components/PageHeader.jsx';
import './Reports.css';

function exportToCSV(movement, topCategory) {
  const rows = [
    ['Day', 'Units in', 'Units out', 'Total'],
    ...movement.map((d) => [d.day, d.unitsIn, d.unitsOut, d.total]),
    [],
    ['Category', 'Value', 'Percentage'],
    ...(topCategory?.breakdown || []).map((b) => [b.category, b.value, b.percentage]),
  ];
  const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reports.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [movement, setMovement] = useState([]);
  const [topCategoryData, setTopCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [movementRes, categoryRes] = await Promise.all([
          api.get('/reports/units-movement'),
          api.get('/reports/top-category'),
        ]);
        setMovement(movementRes.data);
        setTopCategoryData(categoryRes.data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  // Highlight the top 2 days by total volume
  const sortedTotals = [...movement].map((d) => d.total).sort((a, b) => b - a);
  const highlightThreshold = sortedTotals[1] ?? sortedTotals[0] ?? 0;

  const top = topCategoryData?.topCategory;
  const donutData = top
    ? [
        { name: top.category, value: top.percentage },
        { name: 'Other', value: 100 - top.percentage },
      ]
    : [{ name: 'No data', value: 100 }];

  return (
    <div>
      <PageHeader
        breadcrumb="Stockwise / Reports"
        eyebrow="Insights"
        title="Reports"
        subtitle="The numbers behind your inventory performance."
        actionLabel="Download report"
        onAction={() => exportToCSV(movement, topCategoryData)}
      />

      <div className="reports-grid">
        <div className="card">
          <div className="eyebrow">Stock movement</div>
          <h3 className="report-card-title">Units in &amp; out</h3>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={movement} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#6b7280' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={36}>
                  {movement.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.total >= highlightThreshold && d.total > 0 ? '#1f3d2e' : '#a9c9b3'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="eyebrow">Top category</div>
          <h3 className="report-card-title">
            {top ? `${top.category} leads the way` : 'No category data yet'}
          </h3>

          {top && (
            <>
              <div className="donut-percentage">{top.percentage}%</div>
              <div className="donut-caption">of your current inventory value</div>

              <div className="donut-wrapper">
                <PieChart width={180} height={180}>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    <Cell fill="#1f3d2e" />
                    <Cell fill="#dcead1" />
                  </Pie>
                </PieChart>
                <div className="donut-center-label">{top.category}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}