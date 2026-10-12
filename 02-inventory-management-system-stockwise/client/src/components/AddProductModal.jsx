import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import './AddProductModal.css';

export default function AddProductModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    price: 0,
    reorderLevel: 15,
    criticalLevel: 8,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.sku || !form.category) {
      setError('Name, SKU, and category are required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/products', {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        reorderLevel: Number(form.reorderLevel),
        criticalLevel: Number(form.criticalLevel),
      });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add product</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label">Product name</label>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <label className="form-label">SKU</label>
          <input
            className="form-input"
            value={form.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
          />

          <label className="form-label">Category</label>
          <input
            className="form-input"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="e.g. Furniture"
          />

          <div className="form-row">
            <div>
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={form.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-input"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Reorder level</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={form.reorderLevel}
                onChange={(e) => handleChange('reorderLevel', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Critical level</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={form.criticalLevel}
                onChange={(e) => handleChange('criticalLevel', e.target.value)}
              />
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn-primary modal-submit" disabled={saving}>
            {saving ? 'Adding...' : 'Add product'}
          </button>
        </form>
      </div>
    </div>
  );
}