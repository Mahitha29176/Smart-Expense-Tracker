import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';

const COLORS = ['#6366f1', '#f97316', '#22c55e', '#ec4899', '#eab308', '#3b82f6', '#ef4444', '#8b5cf6'];

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/expenses/stats/summary');
        setStats(data.data);
      } catch (err) {
        setError('Could not load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const monthlyData = {};
  (stats?.byMonth || []).forEach((entry) => {
    const key = `${entry._id.month}/${entry._id.year}`;
    if (!monthlyData[key]) monthlyData[key] = { name: key, income: 0, expense: 0 };
    monthlyData[key][entry._id.type] = entry.total;
  });
  const chartData = Object.values(monthlyData);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Dashboard</h1>

        {loading && <div className="page-loader">Loading...</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {stats && (
          <>
            <div className="stats-grid">
              <StatCard label="Total Income" value={formatCurrency(stats.totalIncome)} icon="💰" tone="success" />
              <StatCard label="Total Expenses" value={formatCurrency(stats.totalExpense)} icon="💸" tone="danger" />
              <StatCard
                label="Balance"
                value={formatCurrency(stats.balance)}
                icon="📊"
                tone={stats.balance >= 0 ? 'success' : 'danger'}
              />
            </div>

            <div className="charts-grid">
              <div className="card">
                <h3>Spending by Category</h3>
                {stats.byCategory.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.byCategory}
                        dataKey="total"
                        nameKey="category.name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => entry.category.name}
                      >
                        {stats.byCategory.map((entry, index) => (
                          <Cell key={entry._id} fill={entry.category.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">No expense data yet</div>
                )}
              </div>

              <div className="card">
                <h3>Income vs Expense by Month</h3>
                {chartData.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="income" fill="#22c55e" />
                      <Bar dataKey="expense" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">No monthly data yet</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
