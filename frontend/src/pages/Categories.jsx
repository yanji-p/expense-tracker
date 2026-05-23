import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', color: '#3b82f6' });

  const fetchCategories = async () => {
    const res = await axios.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post('/categories', form);
    setForm({ name: '', color: '#3b82f6' });
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🏷️ Categories</h2>

      <div style={styles.card}>
        <h3 style={styles.subheading}>Add Category</h3>
        <form onSubmit={handleAdd} style={styles.form}>
          <input style={styles.input} placeholder="Category name (e.g. Food)"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <div style={styles.colorRow}>
            <label style={{fontSize:'14px',color:'#64748b'}}>Color:</label>
            <input type="color" value={form.color}
              onChange={e => setForm({...form, color: e.target.value})}
              style={{width:'40px', height:'36px', border:'none', cursor:'pointer'}} />
          </div>
          <button style={styles.btn} type="submit">Add Category</button>
        </form>
      </div>

      <div style={styles.list}>
        {categories.map(cat => (
          <div key={cat.id} style={styles.catItem}>
            <div style={{...styles.colorDot, background: cat.color}} />
            <span style={styles.catName}>{cat.name}</span>
            <button onClick={() => handleDelete(cat.id)} style={styles.delBtn}>✕</button>
          </div>
        ))}
        {categories.length === 0 && <p style={{color:'#94a3b8'}}>No categories yet.</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth:'600px', margin:'40px auto', padding:'0 20px' },
  heading: { color:'#1e293b', marginBottom:'24px' },
  card: { background:'#fff', padding:'24px', borderRadius:'10px',
    boxShadow:'0 2px 10px rgba(0,0,0,0.07)', marginBottom:'24px' },
  subheading: { color:'#334155', marginBottom:'16px' },
  form: { display:'flex', flexDirection:'column', gap:'12px' },
  input: { padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', fontSize:'14px' },
  colorRow: { display:'flex', alignItems:'center', gap:'10px' },
  btn: { padding:'10px', background:'#3b82f6', color:'#fff', border:'none',
    borderRadius:'6px', cursor:'pointer', fontSize:'14px' },
  list: { display:'flex', flexDirection:'column', gap:'10px' },
  catItem: { display:'flex', alignItems:'center', gap:'14px', background:'#fff',
    padding:'14px 18px', borderRadius:'8px', boxShadow:'0 1px 6px rgba(0,0,0,0.06)' },
  colorDot: { width:'18px', height:'18px', borderRadius:'50%' },
  catName: { flex:1, fontSize:'15px', color:'#1e293b' },
  delBtn: { background:'#fee2e2', color:'#dc2626', border:'none',
    borderRadius:'6px', padding:'4px 10px', cursor:'pointer' },
};