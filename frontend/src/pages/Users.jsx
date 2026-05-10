import { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/users', { name, email, phoneNo });
      setName('');
      setEmail('');
      setPhoneNo('');
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-lg">
      <div>
        <h2 className="text-accent mb-4">Users</h2>
        <div className="list-group">
          {users.length === 0 ? (
            <p>No users found. Create one!</p>
          ) : (
            users.map(user => (
              <div key={user.id} className="list-item">
                <div>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <div className="text-secondary" style={{ fontSize: '0.875rem' }}>{user.email} | {user.phoneNo}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        <div className="glass-card">
          <h3 className="mb-4">Create New User</h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone No</label>
              <input type="text" className="form-input" value={phoneNo} onChange={e => setPhoneNo(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-full">Create User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Users;
