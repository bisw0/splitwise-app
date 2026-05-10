import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users as UsersIcon, Plus } from 'lucide-react';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/groups');
      setGroups(res.data);
    } catch (error) {
      console.error('Error fetching groups', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users');
      setUsers(res.data);
      if (res.data.length > 0) {
        setCreatorId(res.data[0].id.toString());
      }
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
    if (!creatorId) return alert('Select a creator');
    try {
      await axios.post('http://localhost:8080/api/groups', {
        groupName,
        userIds: selectedUserIds.map(Number),
        creatorId: Number(creatorId)
      });
      setGroupName('');
      setSelectedUserIds([]);
      fetchGroups();
    } catch (error) {
      console.error('Error creating group', error);
    }
  };

  const handleUserSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedUserIds(value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1>Your Groups</h1>
      </div>

      <div className="grid grid-cols-3 gap-lg">
        <div className="grid-cols-2" style={{ gridColumn: 'span 2' }}>
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
                  <div className="glass-card">
                    <h3 className="mb-2 text-accent">{group.grouName}</h3>
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
            <h3 className="mb-4 flex items-center"><Plus size={20} style={{ marginRight: '0.5rem' }} /> Create Group</h3>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label className="form-label">Group Name</label>
                <input type="text" className="form-input" value={groupName} onChange={e => setGroupName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Creator</label>
                <select className="form-input" value={creatorId} onChange={e => setCreatorId(e.target.value)} required>
                  <option value="">Select Creator</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Members (Ctrl+Click to multi-select)</label>
                <select multiple className="form-input" value={selectedUserIds} onChange={handleUserSelect} style={{ height: '100px' }}>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
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
