import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>💰 Expense Tracker</Link>
      </div>
      <div className="navbar-links">
        {user.role === 'admin' ? (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/expenses">All Expenses</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>
      <div className="navbar-user">
        <span className="navbar-username">Hi, {user.name}</span>
        <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
