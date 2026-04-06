import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'user';
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    if (role === 'admin') { setEmail('admin@workforce.com'); setPassword('Admin@123'); }
    else { setEmail('user@workforce.com'); setPassword('User@123'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#1a56db,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-mortarboard-fill text-white"></i>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>WorkforceDev</span>
          </Link>
          <h2 style={{ color: '#fff', fontWeight: 800 }}>Sign In</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Access your learning portal</p>
        </div>

        {/* Role Toggle */}
        <div className="d-flex mb-4 p-1" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10 }}>
          {['user', 'admin'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: role === r ? '#1a56db' : 'transparent', color: role === r ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
              <i className={`bi ${r === 'admin' ? 'bi-shield-fill' : 'bi-person-fill'} me-2`}></i>
              {r === 'admin' ? 'Admin' : 'User'} Login
            </button>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28 }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14 }} />
            </div>
            <div className="mb-4">
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14 }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Sign In as {role === 'admin' ? 'Admin' : 'User'}
            </button>
          </form>

          <button onClick={fillDemo} style={{ width: '100%', marginTop: 12, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            <i className="bi bi-magic me-2"></i>Fill Demo Credentials
          </button>
        </div>

        <p className="text-center mt-4" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          No account? <Link to="/register" style={{ color: '#60a5fa', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
