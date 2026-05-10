import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, User as UserIcon, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, name);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="glass-card animate-pop-in" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="text-center mb-8">
          <div className="avatar mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
            <LogIn size={32} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to manage your expenses</p>
        </div>

        {error && (
          <div className="error-banner mb-4 flex items-center">
            <AlertCircle size={18} className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <div className="input-with-icon">
              <UserIcon size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-input with-icon" 
                placeholder="Enter your name" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                className="form-input with-icon" 
                placeholder="email@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full py-3" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6" style={{ borderTop: '1px solid var(--border-light)' }}>
          <p style={{ fontSize: '0.875rem' }}>
            Don't have an account? <Link to="/register" className="text-accent">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
