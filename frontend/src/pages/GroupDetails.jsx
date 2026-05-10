import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [owedBy, setOwedBy] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/groups/${id}`);
      setGroup(res.data);
    } catch (error) {
      console.error('Error fetching group', error);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!paidBy || owedBy.length === 0) return alert('Please select payer and at least one person who owes');

    // Split equally
    const amountPerPerson = Math.floor(Number(amount) / owedBy.length);
    
    const request = {
      amount: Number(amount),
      groupId: Number(id),
      paidBy: [{ userId: Number(paidBy), amount: Number(amount) }],
      owedBy: owedBy.map(userId => ({ userId: Number(userId), amount: amountPerPerson }))
    };

    try {
      await axios.post('http://localhost:8080/api/expenses', request);
      setAmount('');
      setPaidBy('');
      setOwedBy([]);
      fetchGroup(); // Refresh
    } catch (error) {
      console.error('Error adding expense', error);
    }
  };

  const handleSettleUp = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/groups/${id}/settleUp`);
      setSettlement(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error settling up', error);
      alert('Could not settle up.');
    }
  };

  const handleOwedBySelect = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setOwedBy(value);
  };

  if (!group) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">{group.grouName}</h1>
          <p>Created by {group.groupCreater?.name}</p>
        </div>
        <button onClick={handleSettleUp} className="btn btn-success">
          <CheckCircle2 size={20} />
          Settle Up
        </button>
      </div>

      <div className="grid grid-cols-2 gap-lg">
        <div>
          <h2 className="mb-4 text-accent">Group Members</h2>
          <div className="list-group mb-8">
            {group.users?.map(user => (
              <div key={user.id} className="list-item">
                <span>{user.name}</span>
                <span className="text-secondary">{user.email}</span>
              </div>
            ))}
          </div>

          <h2 className="mb-4 text-warning">Expenses</h2>
          <div className="list-group">
            {!group.expenses || group.expenses.length === 0 ? (
              <p>No expenses yet.</p>
            ) : (
              group.expenses.map((exp, idx) => (
                <div key={idx} className="list-item">
                  <span>Expense</span>
                  <span className="text-danger" style={{ fontWeight: 600 }}>${exp.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="glass-card">
            <h3 className="mb-4">Add Expense</h3>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} required min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Paid By</label>
                <select className="form-input" value={paidBy} onChange={e => setPaidBy(e.target.value)} required>
                  <option value="">Select Payer</option>
                  {group.users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Split Among (Ctrl+Click)</label>
                <select multiple className="form-input" value={owedBy} onChange={handleOwedBySelect} required style={{ height: '100px' }}>
                  {group.users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full">Add Expense</button>
            </form>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Settlement Plan</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            {settlement?.transactions?.length === 0 ? (
              <p className="text-center text-secondary">You are all settled up! 🎉</p>
            ) : (
              <div className="list-group">
                {settlement?.transactions?.map((t, idx) => (
                  <div key={idx} className="list-item">
                    <span style={{ fontWeight: 600 }}>{t.paidBy}</span>
                    <span className="text-warning flex items-center mx-2">
                      owes ${t.ammountPaid} <ArrowLeftRight size={16} className="ml-2" />
                    </span>
                    <span style={{ fontWeight: 600 }}>{t.paidTo}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="btn btn-primary w-full mt-8" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
