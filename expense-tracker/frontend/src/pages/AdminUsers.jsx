import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/users', { params: { search } });
    setUsers(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleToggleStatus = async (id) => {
    await api.put(`/admin/users/${id}/status`);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all of their expenses? This cannot be undone.')) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Manage Users</h1>

        <div className="card">
          <div className="filters-row">
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="page-loader">Loading...</div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`pill ${u.isActive ? 'pill-income' : 'pill-expense'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button className="btn btn-sm btn-ghost" onClick={() => handleToggleStatus(u._id)}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td colSpan="5" className="empty-state">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
