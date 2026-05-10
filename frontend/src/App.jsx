import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import Users from './pages/Users';
import Login from './pages/Login';
import Register from './pages/Register';
import { Wallet, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Wallet size={28} />
          SplitwiseClone
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/users" className="nav-link">Users</Link>
              <div className="user-profile">
                <span>{user.name}</span>
                <button onClick={handleLogout} className="btn-icon" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <main className="container animate-fade-in">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/groups/:id" element={
              <ProtectedRoute>
                <GroupDetails />
              </ProtectedRoute>
            } />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
