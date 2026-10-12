import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const presetColors = ['#6366F1', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#22C55E'];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState(presetColors[0]);

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/categories', { name, color });
    setName('');
    fetchCategories();
  };

  const handleDelete = async (id) => {
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1>Categories</h1>

        <form className="category-form" onSubmit={handleAdd}>
          <input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="color-picker">
            {presetColors.map((c) => (
              <span
                key={c}
                className={`color-swatch ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <button type="submit" className="btn-primary">Add</button>
        </form>

        <div className="category-list">
          {categories.map((c) => (
            <div key={c._id} className="category-list-item">
              <span className="category-dot" style={{ backgroundColor: c.color }} />
              <span>{c.name}</span>
              <button className="btn-ghost" onClick={() => handleDelete(c._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;