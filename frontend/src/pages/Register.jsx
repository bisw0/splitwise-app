import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../api/userService';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, User as UserIcon, Phone, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createUser({ name, email, phoneNo });
      if (response.data) {
        // Auto-login after registration
        await login(email, name);
        navigate('/');
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card animate-pop-in" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="text-center mb-8">
          <div className="avatar mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
            <UserPlus size={32} />
          </div>
          <h1>Create Account</h1>
          <p>Join Splitwise to start splitting</p>
        </div>

        {error && (
          <div className="error-banner mb-4 flex items-center">
            <AlertCircle size={18} className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <UserIcon size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-input with-icon" 
                placeholder="John Doe" 
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
                placeholder="john@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-input with-icon" 
                placeholder="+1 234 567 890" 
                value={phoneNo}
                onChange={e => setPhoneNo(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full py-3" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6" style={{ borderTop: '1px solid var(--border-light)' }}>
          <p style={{ fontSize: '0.875rem' }}>
            Already have an account? <Link to="/login" className="text-accent">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
