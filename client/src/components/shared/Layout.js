import React from 'react';
import UserSidebar from './UserSidebar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

export const UserLayout = ({ title, children }) => {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';

  return (
    <div className="app-layout">
      <UserSidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="page-title">{title}</span>
          <div className="user-badge">
            <div className="avatar">{initials}</div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</span>
          </div>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export const AdminLayout = ({ title, children }) => {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'A';

  return (
    <div className="app-layout">
      <AdminSidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="page-title">{title}</span>
          <span className="badge bg-danger me-2" style={{ fontSize: 11 }}>ADMIN</span>
          <div className="user-badge">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #dc2626, #7c3aed)' }}>{initials}</div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</span>
          </div>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};
