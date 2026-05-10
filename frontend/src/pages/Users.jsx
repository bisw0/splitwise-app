import { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { getUsers, createUser } from '../api/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
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
      await createUser({ name, email, phoneNo });
      setName('');
      setEmail('');
      setPhoneNo('');
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-3 gap-lg">
      <div style={{ gridColumn: 'span 2' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-accent">Users</h2>
          <div className="search-input-wrapper" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="user-list-container">
          {filteredUsers.length === 0 ? (
            <div className="glass-card text-center py-8">
              <p className="text-secondary">No users found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-md">
              {filteredUsers.map(user => (
                <div key={user.id} className="glass-card flex items-center">
                  <div className="avatar mr-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                    <div className="text-secondary" style={{ fontSize: '0.875rem' }}>{user.email}</div>
                    <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{user.phoneNo}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <div className="glass-card sticky-top">
          <h3 className="mb-4 flex items-center">
            <UserPlus size={20} className="mr-2" style={{ marginRight: '0.5rem' }} /> 
            Create New User
          </h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone No</label>
              <input type="text" className="form-input" value={phoneNo} onChange={e => setPhoneNo(e.target.value)} required placeholder="+1 234 567 890" />
            </div>
            <button type="submit" className="btn btn-primary w-full">Create User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Users;
