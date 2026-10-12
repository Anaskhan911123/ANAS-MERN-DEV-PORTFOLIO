import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, MoreHorizontal } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/PageHeader.jsx';
import AddProductModal from '../components/AddProductModal.jsx';
import { getCategoryColor } from '../utils/categoryColors';
import './Inventory.css';

function statusKey(status) {
  if (status === 'Healthy') return 'healthy';
  if (status === 'Low stock') return 'low';
  return 'critical';
}

function formatUpdated(dateStr) {
  const updated = new Date(dateStr);
  const now = new Date();
  const isToday = updated.toDateString() === now.toDateString();
  if (isToday) return 'Last updated today';
  return `Last updated ${updated.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All categories') params.category = category;
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const categories = ['All categories', ...new Set(products.map((p) => p.category))];

  const visibleProducts = products.filter((p) => {
    if (statusFilter === 'All statuses') return true;
    return p.status === statusFilter;
  });

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setOpenMenuId(null);
      loadProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Stockwise / Inventory"
        eyebrow="Catalog"
        title="Inventory"
        subtitle="Manage products, quantities, and reorder levels."
        actionLabel="+ Add product"
        onAction={() => setShowAddModal(true)}
      />

      <div className="card">
        <div className="inventory-toolbar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search inventory"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="filters-wrapper">
            <button className="filters-btn" onClick={() => setShowFilters((v) => !v)}>
              <SlidersHorizontal size={14} /> Filters
            </button>
            {showFilters && (
              <div className="filters-dropdown">
                {['All statuses', 'Healthy', 'Low stock', 'Critical'].map((s) => (
                  <div
                    key={s}
                    className={`filter-option ${statusFilter === s ? 'filter-option-active' : ''}`}
                    onClick={() => { setStatusFilter(s); setShowFilters(false); }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>In stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((p) => (
              <tr key={p._id}>
                <td>
                  <div className="product-cell">
                    <div className="product-icon" style={{ background: getCategoryColor(p.category) }} />
                    <div>
                      <div className="product-name">{p.name}</div>
                      <div className="product-updated">{formatUpdated(p.updatedAt)}</div>
                    </div>
                  </div>
                </td>
                <td className="cell-muted">{p.sku}</td>
                <td className="cell-muted">{p.category}</td>
                <td>{p.quantity} units</td>
                <td>
                  <span className={`badge badge-${statusKey(p.status)}`}>{p.status}</span>
                </td>
                <td className="menu-cell">
                  <button
                    className="menu-btn"
                    onClick={() => setOpenMenuId(openMenuId === p._id ? null : p._id)}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenuId === p._id && (
                    <div className="row-menu">
                      <div className="row-menu-item" onClick={() => handleDelete(p._id)}>Delete</div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && visibleProducts.length === 0 && (
          <div className="empty-state">No products match your search.</div>
        )}
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => { setShowAddModal(false); loadProducts(); }}
        />
      )}
    </div>
  );
}