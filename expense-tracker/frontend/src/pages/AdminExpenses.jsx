import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchExpenses = async (page = 1) => {
    setLoading(true);
    const { data } = await api.get('/admin/expenses', { params: { page, limit: 15 } });
    setExpenses(data.data);
    setPagination({ page: data.page, pages: data.pages || 1 });
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses(1);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">All Transactions</h1>

        <div className="card">
          {loading ? (
            <div className="page-loader">Loading...</div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp._id}>
                        <td>{new Date(exp.date).toLocaleDateString()}</td>
                        <td>{exp.user?.name} <span className="text-muted">({exp.user?.email})</span></td>
                        <td>{exp.title}</td>
                        <td>{exp.category?.icon} {exp.category?.name}</td>
                        <td><span className={`pill pill-${exp.type}`}>{exp.type}</span></td>
                        <td className={exp.type === 'income' ? 'amount-income' : 'amount-expense'}>
                          {formatCurrency(exp.amount)}
                        </td>
                      </tr>
                    ))}
                    {!expenses.length && (
                      <tr><td colSpan="6" className="empty-state">No transactions found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {pagination.pages > 1 && (
                <div className="pagination">
                  <button className="btn btn-sm" disabled={pagination.page <= 1} onClick={() => fetchExpenses(pagination.page - 1)}>
                    Previous
                  </button>
                  <span>Page {pagination.page} of {pagination.pages}</span>
                  <button className="btn btn-sm" disabled={pagination.page >= pagination.pages} onClick={() => fetchExpenses(pagination.page + 1)}>
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

export default AdminExpenses;
