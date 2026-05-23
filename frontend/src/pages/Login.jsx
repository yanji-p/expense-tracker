import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💰 Expense Tracker</h2>
        <h3 style={styles.subtitle}>Sign In</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button style={styles.btn} type="submit">Login</button>
        </form>
        <p style={styles.foot}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', display:'flex', justifyContent:'center',
    alignItems:'center', background:'#f1f5f9' },
  card: { background:'#fff', padding:'40px', borderRadius:'12px',
    boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'360px' },
  title: { textAlign:'center', color:'#1e293b', marginBottom:'4px' },
  subtitle: { textAlign:'center', color:'#64748b', fontWeight:'normal', marginBottom:'20px' },
  error: { background:'#fee2e2', color:'#dc2626', padding:'10px', borderRadius:'6px', marginBottom:'12px' },
  input: { width:'100%', padding:'10px 12px', margin:'8px 0', border:'1px solid #cbd5e1',
    borderRadius:'6px', fontSize:'14px', boxSizing:'border-box' },
  btn: { width:'100%', padding:'12px', background:'#3b82f6', color:'#fff',
    border:'none', borderRadius:'6px', fontSize:'16px', cursor:'pointer', marginTop:'8px' },
  foot: { textAlign:'center', marginTop:'16px', fontSize:'14px', color:'#64748b' },
};