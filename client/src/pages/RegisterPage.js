import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success('Account created successfully!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14 };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#1a56db,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-mortarboard-fill text-white"></i>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>WorkforceDev</span>
          </Link>
          <h2 style={{ color: '#fff', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Join thousands of learners today</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28 }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label style={labelStyle}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" style={inputStyle} />
            </div>
            <div className="mb-3">
              <label style={labelStyle}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" style={inputStyle} />
            </div>
            <div className="mb-3">
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min. 6 characters" style={inputStyle} />
            </div>
            <div className="mb-3">
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat password" style={inputStyle} />
            </div>
            <div className="mb-4">
              <label style={labelStyle}>Account Type</label>
              <select name="role" value={form.role} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="user">User / Learner</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center mt-4" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          Have an account? <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
