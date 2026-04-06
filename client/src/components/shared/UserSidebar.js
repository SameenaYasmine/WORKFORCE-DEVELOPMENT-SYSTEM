import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: 'bi-house-fill', label: 'Dashboard' },
    { path: '/courses', icon: 'bi-play-circle-fill', label: 'Courses' },
    { path: '/certificates', icon: 'bi-award-fill', label: 'Certificates' },
    { path: '/jobs', icon: 'bi-briefcase-fill', label: 'Job Opportunities' },
    { path: '/profile', icon: 'bi-person-fill', label: 'My Profile' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="sidebar">
      <div className="sidebar-brand d-flex align-items-center">
        <div className="brand-logo"><i className="bi bi-mortarboard-fill"></i></div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>WorkforceDev</div>
          <div style={{ fontSize: 11, opacity: 0.5 }}>Learning Portal</div>
        </div>
      </div>

      <div className="sidebar-nav mt-2">
        <div className="nav-section">Main Menu</div>
        {navItems.map(item => (
          <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
            <i className={`bi ${item.icon}`}></i>
            {item.label}
          </Link>
        ))}

        <div className="nav-section" style={{ marginTop: 20 }}>Account</div>
        <div style={{ padding: '10px 24px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          <div style={{ fontWeight: 600, color: '#fff' }}>{user?.name}</div>
          <div>{user?.email}</div>
        </div>
        <button onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
