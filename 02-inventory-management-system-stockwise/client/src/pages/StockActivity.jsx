import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Pencil } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/PageHeader.jsx';
import './StockActivity.css';

const activityMeta = {
  received: { icon: <ArrowDown size={16} />, label: 'Stock received', cls: 'activity-received' },
  fulfilled: { icon: <ArrowUp size={16} />, label: 'Order fulfilled', cls: 'activity-fulfilled' },
  adjusted: { icon: <Pencil size={16} />, label: 'Inventory adjusted', cls: 'activity-adjusted' },
};

function formatTimestamp(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return `Today, ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isYesterday) return `Yesterday, ${time}`;

  const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${dateLabel}, ${time}`;
}

function exportToCSV(activity) {
  const rows = [
    ['Type', 'Description', 'Quantity', 'Timestamp'],
    ...activity.map((a) => [activityMeta[a.type].label, a.description, a.quantity, new Date(a.createdAt).toISOString()]),
  ];
  const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'stock-activity.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function StockActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/stock/activity');
        setActivity(res.data);
      } catch (err) {
        console.error('Failed to load activity:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <PageHeader
        breadcrumb="Stockwise / Stock activity"
        eyebrow="History"
        title="Stock activity"
        subtitle="A complete record of every inventory movement."
        actionLabel="Export activity"
        onAction={() => exportToCSV(activity)}
      />

      <div className="card">
        {loading && <div className="empty-state">Loading...</div>}

        {!loading && activity.length === 0 && (
          <div className="empty-state">No activity yet.</div>
        )}

        <div className="full-activity-list">
          {activity.map((a) => {
            const meta = activityMeta[a.type];
            return (
              <div className="full-activity-item" key={a._id}>
                <div className={`activity-icon ${meta.cls}`}>{meta.icon}</div>
                <div className="activity-info">
                  <div className="activity-title">{meta.label}</div>
                  <div className="activity-desc">{a.description}</div>
                </div>
                <div className="activity-timestamp">{formatTimestamp(a.createdAt)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}