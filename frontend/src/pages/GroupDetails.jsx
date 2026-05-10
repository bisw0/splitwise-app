import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeftRight, CheckCircle2, User, DollarSign, Plus, UserPlus, Shield, ShieldCheck, Search } from 'lucide-react';
import { getGroupById, settleUp, addMember, addAdmin } from '../api/groupService';
import { createExpense } from '../api/expenseService';
import { getUsers } from '../api/userService';
import { useAuth } from '../context/AuthContext';

const GroupDetails = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [group, setGroup] = useState(null);
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUser?.id || '');
  const [owedBy, setOwedBy] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchGroup = async () => {
    try {
      const res = await getGroupById(id);
      setGroup(res.data);
      if (res.data.users && res.data.users.length > 0) {
        setPaidBy(currentUser?.id || res.data.users[0].id);
      }
    } catch (error) {
      console.error('Error fetching group', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await getUsers();
      setAllUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchGroup();
    fetchAllUsers();
  }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!paidBy || owedBy.length === 0) return alert('Please select payer and at least one person who owes');

    setLoading(true);
    const amountPerPerson = Math.floor(Number(amount) / owedBy.length);
    
    const request = {
      amount: Number(amount),
      groupId: Number(id),
      paidBy: [{ userId: Number(paidBy), amount: Number(amount) }],
      owedBy: owedBy.map(userId => ({ userId: Number(userId), amount: amountPerPerson }))
    };

    try {
      await createExpense(request);
      setAmount('');
      setOwedBy([]);
      fetchGroup();
    } catch (error) {
      console.error('Error adding expense', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettleUp = async () => {
    try {
      const res = await settleUp(id);
      setSettlement(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error settling up', error);
      alert('Could not settle up.');
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await addMember(id, userId);
      setIsAddMemberModalOpen(false);
      fetchGroup();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handlePromoteAdmin = async (userId) => {
    try {
      await addAdmin(id, userId);
      fetchGroup();
    } catch (error) {
      console.error("Error promoting admin:", error);
    }
  };

  const toggleOwedBy = (userId) => {
    const idStr = userId.toString();
    setOwedBy(prev => 
      prev.includes(idStr) ? prev.filter(i => i !== idStr) : [...prev, idStr]
    );
  };

  const isAdmin = group?.groupAdmins?.some(admin => admin.id === currentUser?.id);
  const isUserAdmin = (userId) => group?.groupAdmins?.some(admin => admin.id === userId);

  const nonMembers = allUsers.filter(u => 
    !group?.users?.some(member => member.id === u.id) &&
    (u.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(memberSearchTerm.toLowerCase()))
  );

  if (!group) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="mb-2">{group.groupName}</h1>
          <div className="flex items-center text-secondary">
            <User size={16} className="mr-2" />
            <span>Admin(s): {group.groupAdmins?.map(a => a.name).join(', ')}</span>
          </div>
        </div>
        <div className="flex gap-md">
          {isAdmin && (
            <button onClick={() => setIsAddMemberModalOpen(true)} className="btn btn-outline">
              <UserPlus size={20} />
              Add Member
            </button>
          )}
          <button onClick={handleSettleUp} className="btn btn-success shadow-lg">
            <CheckCircle2 size={20} className="mr-2" />
            Settle Up
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-lg">
        <div style={{ gridColumn: 'span 2' }}>
          <div className="glass-card mb-8">
            <h2 className="mb-4 text-accent">Group Members</h2>
            <div className="grid grid-cols-2 gap-md">
              {group.users?.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 glass-hover rounded-lg">
                  <div className="flex items-center">
                    <div className="avatar small mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 600 }}>{user.name}</span>
                        {isUserAdmin(user.id) && <span className="badge badge-success"><ShieldCheck size={12} /> Admin</span>}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{user.email}</div>
                    </div>
                  </div>
                  
                  {isAdmin && !isUserAdmin(user.id) && (
                    <button 
                      className="btn-icon" 
                      title="Promote to Admin"
                      onClick={() => handlePromoteAdmin(user.id)}
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Shield size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <h2 className="mb-4 text-warning">Recent Expenses</h2>
          {/* ... existing expenses logic ... */}
          <div className="list-group">
            {!group.expenses || group.expenses.length === 0 ? (
              <div className="glass-card text-center py-8">
                <p className="text-secondary">No expenses recorded yet.</p>
              </div>
            ) : (
              group.expenses.map((exp, idx) => (
                <div key={idx} className="list-item glass-hover">
                  <div className="flex items-center">
                    <div className="expense-icon mr-4">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>General Expense</div>
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                        {new Date(exp.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-accent" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    ${exp.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="glass-card sticky-top">
            <h3 className="mb-4 flex items-center">
              <Plus size={20} className="mr-2" />
              Add Expense
            </h3>
            {/* ... existing expense form ... */}
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <div className="input-with-icon">
                  <DollarSign size={18} className="input-icon" />
                  <input 
                    type="number" 
                    className="form-input with-icon" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    required 
                    min="1" 
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Paid By</label>
                <select 
                  className="form-input" 
                  value={paidBy} 
                  onChange={e => setPaidBy(e.target.value)} 
                  required
                >
                  {group.users?.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.id === currentUser?.id ? `Me (${u.name})` : u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Split Among</label>
                <div className="user-selection-list glass small">
                  {group.users?.map(u => (
                    <div 
                      key={u.id} 
                      className={`user-selection-item ${owedBy.includes(u.id.toString()) ? 'selected' : ''}`}
                      onClick={() => toggleOwedBy(u.id)}
                    >
                      <span>{u.name}</span>
                      {owedBy.includes(u.id.toString()) && <Plus size={14} style={{ transform: 'rotate(45deg)' }} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                    {owedBy.length} people selected
                  </span>
                  <button 
                    type="button" 
                    className="link-btn" 
                    onClick={() => setOwedBy(group.users.map(u => u.id.toString()))}
                  >
                    Select All
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Settle Up Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop-in">
            <div className="modal-header">
              <h2>Settlement Plan</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            {settlement?.transactions?.length === 0 ? (
              <div className="text-center py-8">
                <div className="success-icon mb-4">🎉</div>
                <h3>All Settled Up!</h3>
                <p className="text-secondary">No outstanding debts in this group.</p>
              </div>
            ) : (
              <div className="list-group">
                {settlement?.transactions?.map((t, idx) => (
                  <div key={idx} className="list-item">
                    <span style={{ fontWeight: 600 }}>{t.paidBy}</span>
                    <div className="flex flex-col items-center mx-4">
                      <span className="text-warning" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        ${t.ammountPaid}
                      </span>
                      <ArrowLeftRight size={16} className="text-secondary" />
                    </div>
                    <span style={{ fontWeight: 600 }}>{t.paidTo}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="btn btn-primary w-full mt-8" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop-in">
            <div className="modal-header">
              <h2>Add Group Member</h2>
              <button className="modal-close" onClick={() => setIsAddMemberModalOpen(false)}>&times;</button>
            </div>
            
            <div className="search-input-wrapper mb-4">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Search by name or email..." 
                value={memberSearchTerm}
                onChange={e => setMemberSearchTerm(e.target.value)}
              />
            </div>

            <div className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {nonMembers.map(u => (
                <div key={u.id} className="list-item glass-hover">
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{u.email}</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => handleAddMember(u.id)}>
                    <Plus size={16} />
                  </button>
                </div>
              ))}
              {nonMembers.length === 0 && (
                <p className="text-center text-secondary py-4">No other users found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
