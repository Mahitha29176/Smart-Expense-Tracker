import { useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget || 0);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = { name, monthlyBudget: parseFloat(monthlyBudget) || 0 };
      if (password) payload.password = password;

      const { data } = await api.put('/auth/me', payload);
      const updated = { ...user, ...data.data };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setMessage('Profile updated successfully');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Profile</h1>
        <form className="card auth-card" onSubmit={handleSubmit}>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input value={user?.email} disabled />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Monthly Budget</label>
            <input type="number" step="0.01" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} />
          </div>
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
