import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Pencil } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/PageHeader.jsx';
import { getCategoryColor } from '../utils/categoryColors';
import './Overview.css';

function statusKey(status) {
  if (status === 'Healthy') return 'healthy';
  if (status === 'Low stock') return 'low';
  return 'critical';
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  return `${Math.floor(diffHr / 24)}d`;
}

const activityMeta = {
  received: { icon: <ArrowDown size={16} />, label: 'Stock received', cls: 'activity-received' },
  fulfilled: { icon: <ArrowUp size={16} />, label: 'Order fulfilled', cls: 'activity-fulfilled' },
  adjusted: { icon: <Pencil size={16} />, label: 'Inventory adjusted', cls: 'activity-adjusted' },
};

export default function Overview() {
  const [summary, setSummary] = useState(null);
  const [stockOverview, setStockOverview] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [summaryRes, overviewRes, activityRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/stock-overview'),
          api.get('/stock/activity'),
        ]);
        setSummary(summaryRes.data);
        setStockOverview(overviewRes.data);
        setActivity(activityRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !summary) return <div className="page-loading">Loading...</div>;

  const dateLabel = new Date()
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase();

  return (
    <div>
      <PageHeader
        breadcrumb="Inventory workspace"
        eyebrow={dateLabel}
        title="Everything in its place."
        subtitle="Here's a clear look at what needs your attention today."
        actionLabel="+ Add inventory"
      />

      <div className="summary-grid">
        <div className="card">
          <div className="eyebrow">Inventory value</div>
          <div className="summary-number">
            ${summary.inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="summary-sub summary-sub-positive">↗ 8.4% vs last month</div>
        </div>
        <div className="card">
          <div className="eyebrow">Products in stock</div>
          <div className="summary-number">{summary.productsInStock.toLocaleString()}</div>
          <div className="summary-sub">Across {summary.categoryCount} categories</div>
        </div>
        <div className="card">
          <div className="eyebrow">Low stock items</div>
          <div className="summary-number">{summary.lowStockCount}</div>
          <div className="summary-sub">
            <span className="summary-dot" /> {summary.criticalCount} items need attention
          </div>
        </div>
      </div>

      <div className="overview-columns">
        <div className="card">
          <div className="card-header-row">
            <div>
              <div className="eyebrow">Inventory health</div>
              <h3>Stock overview</h3>
            </div>
            <Link to="/inventory" className="card-link">View inventory →</Link>
          </div>

          <div className="stock-list">
            {stockOverview.map((p) => (
              <div className="stock-list-item" key={p._id}>
                <div className="stock-item-left">
                  <div className="stock-item-icon" style={{ background: getCategoryColor(p.category) }} />
                  <div>
                    <div className="stock-item-name">{p.name}</div>
                    <div className="stock-item-meta">{p.category} · {p.sku}</div>
                  </div>
                </div>
                <div className="stock-item-right">
                  <div className="stock-item-qty">{p.quantity} units</div>
                  <div className={`stock-item-status text-${statusKey(p.status)}`}>{p.status}</div>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill progress-${statusKey(p.status)}`}
                    style={{ width: `${Math.min(100, (p.quantity / (p.reorderLevel * 4)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header-row">
            <div>
              <div className="eyebrow">Recent updates</div>
              <h3>Stock activity</h3>
            </div>
          </div>

          <div className="activity-list">
            {activity.map((a) => {
              const meta = activityMeta[a.type];
              return (
                <div className="activity-item" key={a._id}>
                  <div className={`activity-icon ${meta.cls}`}>{meta.icon}</div>
                  <div className="activity-info">
                    <div className="activity-title">{meta.label}</div>
                    <div className="activity-desc">{a.description}</div>
                  </div>
                  <div className="activity-time">{timeAgo(a.createdAt)}</div>
                </div>
              );
            })}
          </div>

          <Link to="/stock-activity" className="card-link see-all">See all activity →</Link>
        </div>
      </div>
    </div>
  );
}