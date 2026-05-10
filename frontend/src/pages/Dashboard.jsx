import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users as UsersIcon, Plus, Search } from 'lucide-react';
import { getGroupsByUserId, createGroup } from '../api/groupService';
import { getUsers } from '../api/userService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuth();

  const fetchGroups = async () => {
    try {
      const res = await getGroupsByUserId(currentUser.id);
      setGroups(res.data);
    } catch (error) {
      console.error('Error fetching groups', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await createGroup({
        groupName,
        userIds: selectedUserIds.map(Number),
        creatorId: currentUser.id
      });
      setGroupName('');
      setSelectedUserIds([]);
      fetchGroups();
    } catch (error) {
      console.error('Error creating group', error);
    }
  };

  const toggleUserSelection = (userId) => {
    const id = userId.toString();
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    user.id !== currentUser.id
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1>Welcome, {currentUser?.name}</h1>
      </div>

      <div className="grid grid-cols-3 gap-lg">
        <div className="grid-cols-2" style={{ gridColumn: 'span 2' }}>
          <h2>Your Groups</h2>
          {groups.length === 0 ? (
            <div className="glass-card text-center">
              <UsersIcon size={48} className="text-secondary mx-auto mb-4" />
              <h3>No groups yet</h3>
              <p>Create a group to start splitting expenses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-md">
              {groups.map(group => (
                <Link to={`/groups/${group.id}`} key={group.id} style={{ textDecoration: 'none' }}>
                   <div className="glass-card glass-hover relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-accent">{group.groupName}</h3>
                      <span className={`badge ${group.resolved ? 'badge-success' : 'badge-danger'}`}>
                        {group.resolved ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center text-secondary" style={{ fontSize: '0.875rem' }}>
                      <UsersIcon size={16} className="mr-2" style={{ marginRight: '0.5rem' }} />
                      {group.users?.length || 0} members
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="glass-card">
            <h3 className="mb-4 flex items-center">
              <Plus size={20} style={{ marginRight: '0.5rem' }} /> 
              Create Group
            </h3>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label className="form-label">Group Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={groupName} 
                  onChange={e => setGroupName(e.target.value)} 
                  required 
                  placeholder="e.g. Summer Trip"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Add Members</label>
                
                {/* WhatsApp-style selected users bar */}
                {selectedUserIds.length > 0 && (
                  <div className="selected-users-bar mb-4 animate-fade-in">
                    {selectedUserIds.map(id => {
                      const u = users.find(user => user.id.toString() === id);
                      return u ? (
                        <div key={id} className="selected-user-pill">
                          <div className="avatar small">{u.name.charAt(0)}</div>
                          <span>{u.name}</span>
                          <button 
                            type="button" 
                            className="remove-btn" 
                            onClick={() => toggleUserSelection(u.id)}
                          >
                            <Plus size={12} style={{ transform: 'rotate(45deg)' }} />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="search-input-wrapper mb-2">
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text" 
                    className="form-input search-input" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="user-selection-list glass">
                  {filteredUsers.map(u => (
                    <div 
                      key={u.id} 
                      className={`user-selection-item ${selectedUserIds.includes(u.id.toString()) ? 'selected' : ''}`}
                      onClick={() => toggleUserSelection(u.id)}
                    >
                      <div className="flex items-center">
                        <div className="avatar small mr-2">{u.name.charAt(0)}</div>
                        <span>{u.name}</span>
                      </div>
                      {selectedUserIds.includes(u.id.toString()) && <Plus size={14} style={{ transform: 'rotate(45deg)', color: 'var(--accent-primary)' }} />}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">Create Group</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
