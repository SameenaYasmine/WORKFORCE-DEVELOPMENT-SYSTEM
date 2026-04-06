import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', icon: 'bi-grid-fill', label: 'Dashboard' },
    { path: '/admin/courses', icon: 'bi-collection-fill', label: 'Course Management' },
    { path: '/admin/jobs', icon: 'bi-briefcase-fill', label: 'Job Management' },
    { path: '/admin/users', icon: 'bi-people-fill', label: 'Users' },
    { path: '/admin/tracking', icon: 'bi-bar-chart-fill', label: 'Progress Tracking' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="sidebar">
      <div className="sidebar-brand d-flex align-items-center">
        <div className="brand-logo" style={{ background: 'linear-gradient(135deg, #dc2626, #7c3aed)' }}>
          <i className="bi bi-shield-fill"></i>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>WorkforceDev</div>
          <div style={{ fontSize: 11, opacity: 0.5 }}>Admin Panel</div>
        </div>
      </div>

      <div className="sidebar-nav mt-2">
        <div className="nav-section">Management</div>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            style={location.pathname === item.path ? { background: '#dc2626' } : {}}
          >
            <i className={`bi ${item.icon}`}></i>
            {item.label}
          </Link>
        ))}

        <div className="nav-section" style={{ marginTop: 20 }}>Account</div>
        <div style={{ padding: '10px 24px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          <div style={{ fontWeight: 600, color: '#fff' }}>{user?.name}</div>
          <div style={{ fontSize: 11 }}>Administrator</div>
        </div>
        <button onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
