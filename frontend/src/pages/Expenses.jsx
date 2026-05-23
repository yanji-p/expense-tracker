import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', amount:'', date:'', category_id:'', note:'' });

  const fetchAll = async () => {
    const [expRes, catRes] = await Promise.all([
      axios.get('/expenses'), axios.get('/categories')
    ]);
    setExpenses(expRes.data);
    setCategories(catRes.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`/expenses/${editing}`, form);
      setEditing(null);
    } else {
      await axios.post('/expenses', form);
    }
    setForm({ title:'', amount:'', date:'', category_id:'', note:'' });
    fetchAll();
  };

  const handleEdit = (exp) => {
    setEditing(exp.id);
    setForm({ title: exp.title, amount: exp.amount,
      date: exp.date?.split('T')[0], category_id: exp.category_id || '', note: exp.note || '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      await axios.delete(`/expenses/${id}`);
      fetchAll();
    }
  };

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>💸 Expenses</h2>

      <div style={styles.card}>
        <h3 style={styles.subheading}>{editing ? '✏️ Edit Expense' : '➕ Add Expense'}</h3>
        <form onSubmit={handleSubmit} style={styles.grid}>
          <input style={styles.input} placeholder="Title" value={form.title}
            onChange={e => setForm({...form, title: e.target.value})} required />
          <input style={styles.input} type="number" placeholder="Amount (Rs.)" value={form.amount}
            onChange={e => setForm({...form, amount: e.target.value})} required />
          <input style={styles.input} type="date" value={form.date}
            onChange={e => setForm({...form, date: e.target.value})} required />
          <select style={styles.input} value={form.category_id}
            onChange={e => setForm({...form, category_id: e.target.value})}>
            <option value="">-- Category --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input style={{...styles.input, gridColumn:'1/-1'}} placeholder="Note (optional)"
            value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
          <button style={styles.btn} type="submit">
            {editing ? 'Update Expense' : 'Add Expense'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({title:'',amount:'',date:'',category_id:'',note:''}); }}
              style={styles.cancelBtn}>Cancel</button>
          )}
        </form>
      </div>

      <div style={styles.totalBar}>
        Total: <strong>Rs. {total.toLocaleString()}</strong>
      </div>

      <div style={styles.list}>
        {expenses.map(exp => (
          <div key={exp.id} style={styles.expItem}>
            <div style={{...styles.catTag, background: exp.category_color || '#94a3b8'}}>
              {exp.category_name || 'Uncategorized'}
            </div>
            <div style={styles.expInfo}>
              <span style={styles.expTitle}>{exp.title}</span>
              <span style={styles.expDate}>{exp.date?.split('T')[0]}</span>
              {exp.note && <span style={styles.expNote}>{exp.note}</span>}
            </div>
            <span style={styles.expAmount}>Rs. {parseFloat(exp.amount).toLocaleString()}</span>
            <div style={styles.actions}>
              <button onClick={() => handleEdit(exp)} style={styles.editBtn}>✏️</button>
              <button onClick={() => handleDelete(exp.id)} style={styles.delBtn}>🗑️</button>
            </div>
          </div>
        ))}
        {expenses.length === 0 && <p style={{color:'#94a3b8'}}>No expenses yet.</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth:'800px', margin:'40px auto', padding:'0 20px' },
  heading: { color:'#1e293b', marginBottom:'24px' },
  card: { background:'#fff', padding:'24px', borderRadius:'10px',
    boxShadow:'0 2px 10px rgba(0,0,0,0.07)', marginBottom:'24px' },
  subheading: { color:'#334155', marginBottom:'16px' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
  input: { padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', fontSize:'14px' },
  btn: { padding:'10px', background:'#3b82f6', color:'#fff', border:'none',
    borderRadius:'6px', cursor:'pointer', fontSize:'14px' },
  cancelBtn: { padding:'10px', background:'#e2e8f0', color:'#475569', border:'none',
    borderRadius:'6px', cursor:'pointer', fontSize:'14px' },
  totalBar: { background:'#dbeafe', color:'#1d4ed8', padding:'12px 18px',
    borderRadius:'8px', marginBottom:'16px', fontSize:'15px' },
  list: { display:'flex', flexDirection:'column', gap:'10px' },
  expItem: { display:'flex', alignItems:'center', gap:'14px', background:'#fff',
    padding:'14px 18px', borderRadius:'8px', boxShadow:'0 1px 6px rgba(0,0,0,0.06)' },
  catTag: { color:'#fff', padding:'3px 10px', borderRadius:'12px', fontSize:'12px', whiteSpace:'nowrap' },
  expInfo: { flex:1, display:'flex', flexDirection:'column', gap:'2px' },
  expTitle: { fontWeight:'600', color:'#1e293b', fontSize:'15px' },
  expDate: { fontSize:'12px', color:'#94a3b8' },
  expNote: { fontSize:'12px', color:'#64748b', fontStyle:'italic' },
  expAmount: { fontWeight:'700', color:'#0f172a', fontSize:'16px', whiteSpace:'nowrap' },
  actions: { display:'flex', gap:'6px' },
  editBtn: { background:'#fef3c7', border:'none', borderRadius:'6px',
    padding:'5px 8px', cursor:'pointer' },
  delBtn: { background:'#fee2e2', border:'none', borderRadius:'6px',
    padding:'5px 8px', cursor:'pointer' },
};