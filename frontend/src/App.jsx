import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import Users from './pages/Users';
import { Wallet } from 'lucide-react';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <Wallet size={28} />
            SplitwiseClone
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/users" className="nav-link">Users</Link>
          </div>
        </div>
      </nav>
      <main className="container animate-fade-in">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
