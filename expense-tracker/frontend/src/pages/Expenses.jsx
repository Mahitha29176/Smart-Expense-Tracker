import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ type: '', category: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data.data);
  };

  const fetchExpenses = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const { data } = await api.get('/expenses', { params });
      setExpenses(data.data);
      setPagination({ page: data.page, pages: data.pages || 1 });
    } catch (err) {
      setError('Could not load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSubmit = async (form, id) => {
    if (id) {
      await api.put(`/expenses/${id}`, form);
      setEditingExpense(null);
    } else {
      await api.post('/expenses', form);
    }
    fetchExpenses(pagination.page);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await api.delete(`/expenses/${id}`);
    fetchExpenses(pagination.page);
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Expenses</h1>

        <ExpenseForm
          categories={categories}
          onSubmit={handleSubmit}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
        />

        <div className="card">
          <div className="filters-row">
            <input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="page-loader">Loading...</div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : (
            <>
              <ExpenseList expenses={expenses} onEdit={setEditingExpense} onDelete={handleDelete} />
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-sm"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchExpenses(pagination.page - 1)}
                  >
                    Previous
                  </button>
                  <span>Page {pagination.page} of {pagination.pages}</span>
                  <button
                    className="btn btn-sm"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => fetchExpenses(pagination.page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
