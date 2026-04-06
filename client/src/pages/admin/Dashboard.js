import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminLayout } from '../../components/shared/Layout';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  const seedData = async () => {
    try {
      await axios.post('/api/admin/seed');
      toast.success('Demo data loaded!');
      window.location.reload();
    } catch { toast.error('Seed failed'); }
  };

  if (loading) return <AdminLayout title="Dashboard"><div className="d-flex justify-content-center py-5"><div className="spinner-border text-danger" /></div></AdminLayout>;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: 'bi-people-fill', color: '#1a56db', bg: '#ebf5ff' },
    { label: 'Total Courses', value: stats?.totalCourses || 0, icon: 'bi-collection-fill', color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Enrollments', value: stats?.totalEnrollments || 0, icon: 'bi-person-plus-fill', color: '#0e9f6e', bg: '#f0fdf4' },
    { label: 'Completions', value: stats?.totalCompletions || 0, icon: 'bi-check-circle-fill', color: '#d97706', bg: '#fffbeb' },
    { label: 'Active Jobs', value: stats?.totalJobs || 0, icon: 'bi-briefcase-fill', color: '#dc2626', bg: '#fef2f2' },
    { label: 'Applications', value: stats?.totalApplications || 0, icon: 'bi-file-text-fill', color: '#0891b2', bg: '#ecfeff' },
  ];

  const completionRate = stats?.totalEnrollments > 0 ? Math.round((stats.totalCompletions / stats.totalEnrollments) * 100) : 0;

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-1">Platform Overview</h5>
          <p className="text-muted small mb-0">Monitor platform activity and performance.</p>
        </div>
        <button onClick={seedData} className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-database-fill me-2"></i>Load Demo Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        {statCards.map((s, i) => (
          <div key={i} className="col-6 col-md-4 col-lg-2">
            <div className="stat-card text-center">
              <div className="stat-icon mx-auto" style={{ background: s.bg, color: s.color }}>
                <i className={`bi ${s.icon}`}></i>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card-custom p-4">
            <h6 className="fw-bold mb-4">Completion Rate</h6>
            <div className="text-center mb-3">
              <div style={{ fontSize: 52, fontWeight: 800, color: completionRate >= 50 ? '#0e9f6e' : '#d97706' }}>{completionRate}%</div>
              <div className="text-muted small">of enrollments completed</div>
            </div>
            <div className="progress-bar-custom" style={{ height: 12 }}>
              <div className="progress-bar-fill" style={{ width: `${completionRate}%`, background: completionRate >= 50 ? 'linear-gradient(90deg,#0e9f6e,#34d399)' : 'linear-gradient(90deg,#f59e0b,#fcd34d)' }}></div>
            </div>
            <div className="d-flex justify-content-between mt-2 small text-muted">
              <span>{stats?.totalCompletions} completed</span>
              <span>{stats?.totalEnrollments - stats?.totalCompletions} in progress</span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card-custom p-4">
            <h6 className="fw-bold mb-4">Quick Actions</h6>
            <div className="d-grid gap-2">
              <a href="/admin/courses/new" className="btn btn-outline-primary text-start">
                <i className="bi bi-plus-circle me-2"></i>Add New Course
              </a>
              <a href="/admin/jobs" className="btn btn-outline-success text-start">
                <i className="bi bi-briefcase me-2"></i>Post Job Opportunity
              </a>
              <a href="/admin/users" className="btn btn-outline-secondary text-start">
                <i className="bi bi-people me-2"></i>View All Users
              </a>
              <a href="/admin/tracking" className="btn btn-outline-warning text-start">
                <i className="bi bi-bar-chart me-2"></i>Progress Tracking
              </a>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="col-12">
          <div className="card-custom p-4">
            <h6 className="fw-bold mb-3">Platform Health</h6>
            <div className="row g-3">
              {[
                { label: 'Avg. enrollments/course', value: stats?.totalCourses ? (stats.totalEnrollments / stats.totalCourses).toFixed(1) : '0', icon: '📊' },
                { label: 'Job application rate', value: stats?.totalJobs ? (stats.totalApplications / stats.totalJobs).toFixed(1) : '0', icon: '💼' },
                { label: 'Courses per user', value: stats?.totalUsers ? (stats.totalEnrollments / stats.totalUsers).toFixed(1) : '0', icon: '👤' },
              ].map((s, i) => (
                <div key={i} className="col-md-4">
                  <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: 28 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
                      <div className="text-muted small">{s.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
