import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  paymentMethod: 'cash',
};

const ExpenseForm = ({ categories, onSubmit, editingExpense, onCancelEdit }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        type: editingExpense.type,
        category: editingExpense.category?._id || editingExpense.category,
        date: editingExpense.date?.slice(0, 10),
        description: editingExpense.description || '',
        paymentMethod: editingExpense.paymentMethod || 'cash',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.amount || !form.category) {
      setError('Please fill in title, amount and category');
      return;
    }

    try {
      await onSubmit({ ...form, amount: parseFloat(form.amount) }, editingExpense?._id);
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form className="card expense-form" onSubmit={handleSubmit}>
      <h3>{editingExpense ? 'Edit Transaction' : 'Add Transaction'}</h3>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Grocery shopping" />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Payment Method</label>
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description (optional)</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingExpense ? 'Update' : 'Add'} Transaction
        </button>
        {editingExpense && (
          <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
