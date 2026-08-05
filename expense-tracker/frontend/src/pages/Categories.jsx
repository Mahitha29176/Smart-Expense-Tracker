import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const EMOJIS = ['📦', '🍔', '🚗', '🛍️', '💡', '🎬', '🏥', '💰', '🏠', '✈️', '📚', '🎮'];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', icon: '📦', color: '#6366f1' });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name) {
      setError('Category name is required');
      return;
    }
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post('/categories', form);
      }
      setForm({ name: '', icon: '📦', color: '#6366f1' });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, icon: cat.icon, color: cat.color });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Expenses using it will keep the reference.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete category');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Categories</h1>

        <form className="card expense-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Category' : 'Add Category'}</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Travel" />
            </div>
            <div className="form-group">
              <label>Icon</label>
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {EMOJIS.map((em) => <option key={em} value={em}>{em}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Color</label>
              <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} Category</button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={() => { setEditingId(null); setForm({ name: '', icon: '📦', color: '#6366f1' }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="category-grid">
          {categories.map((cat) => (
            <div className="card category-card" key={cat._id}>
              <div className="category-icon" style={{ backgroundColor: cat.color }}>{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
              <div className="form-actions">
                <button className="btn btn-sm btn-ghost" onClick={() => handleEdit(cat)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
