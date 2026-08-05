import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await api.get('/admin/stats');
      setStats(data.data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Admin Dashboard</h1>

        {loading && <div className="page-loader">Loading...</div>}

        {stats && (
          <>
            <div className="stats-grid">
              <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
              <StatCard label="Active Users" value={stats.activeUsers} icon="✅" tone="success" />
              <StatCard label="Inactive Users" value={stats.inactiveUsers} icon="🚫" tone="danger" />
              <StatCard label="Transaction Records" value={stats.totalExpenseRecords} icon="🧾" />
              <StatCard label="Platform Income" value={formatCurrency(stats.totalIncome)} icon="💰" tone="success" />
              <StatCard label="Platform Expense" value={formatCurrency(stats.totalExpense)} icon="💸" tone="danger" />
            </div>

            <div className="card">
              <h3>Recent Transactions (All Users)</h3>
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
                    {stats.recentExpenses.map((exp) => (
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
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
