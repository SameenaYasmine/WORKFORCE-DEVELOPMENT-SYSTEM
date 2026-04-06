import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminLayout } from '../../components/shared/Layout';

const AdminTracking = () => {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/course-tracking').then(r => setTracking(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Progress Tracking">
      <div className="mb-4">
        <h5 className="fw-bold mb-1">Course Progress Tracking</h5>
        <p className="text-muted small mb-0">Monitor enrollment and completion rates across all courses.</p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-danger" /></div>
      ) : tracking.length === 0 ? (
        <div className="card-custom p-5 text-center">
          <div style={{ fontSize: 60 }}>📊</div>
          <h5 className="mt-3">No data yet</h5>
          <p className="text-muted">Courses and enrollments will appear here.</p>
        </div>
      ) : (
        <>
          {/* Summary row */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#ebf5ff', color: '#1a56db' }}><i className="bi bi-collection-fill"></i></div>
                <div className="stat-value">{tracking.length}</div>
                <div className="stat-label">Total Courses</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#f0fdf4', color: '#0e9f6e' }}><i className="bi bi-person-plus-fill"></i></div>
                <div className="stat-value">{tracking.reduce((a, c) => a + c.enrolled, 0)}</div>
                <div className="stat-label">Total Enrollments</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fffbeb', color: '#d97706' }}><i className="bi bi-check-circle-fill"></i></div>
                <div className="stat-value">{tracking.reduce((a, c) => a + c.completed, 0)}</div>
                <div className="stat-label">Total Completions</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}><i className="bi bi-graph-up"></i></div>
                <div className="stat-value">
                  {tracking.reduce((a, c) => a + c.enrolled, 0) > 0
                    ? Math.round((tracking.reduce((a, c) => a + c.completed, 0) / tracking.reduce((a, c) => a + c.enrolled, 0)) * 100) : 0}%
                </div>
                <div className="stat-label">Avg. Completion Rate</div>
              </div>
            </div>
          </div>

          {/* Course tracking table */}
          <div className="card-custom overflow-hidden">
            <table className="table table-custom mb-0">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Modules</th>
                  <th>Enrolled</th>
                  <th>Completed</th>
                  <th>Completion Rate</th>
                  <th>Progress Bar</th>
                </tr>
              </thead>
              <tbody>
                {tracking.map(c => {
                  const rate = c.enrolled > 0 ? Math.round((c.completed / c.enrolled) * 100) : 0;
                  return (
                    <tr key={c._id}>
                      <td>
                        <div className="fw-semibold small">{c.title}</div>
                      </td>
                      <td><span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>{c.category}</span></td>
                      <td>{c.modules}</td>
                      <td>
                        <span className="fw-semibold" style={{ color: '#1a56db' }}>{c.enrolled}</span>
                      </td>
                      <td>
                        <span className="fw-semibold" style={{ color: '#0e9f6e' }}>{c.completed}</span>
                      </td>
                      <td>
                        <span className="fw-bold" style={{ color: rate >= 70 ? '#0e9f6e' : rate >= 40 ? '#d97706' : '#dc2626' }}>
                          {rate}%
                        </span>
                      </td>
                      <td style={{ width: 160 }}>
                        <div className="progress-bar-custom">
                          <div className="progress-bar-fill" style={{ width: `${rate}%`, background: rate >= 70 ? 'linear-gradient(90deg,#0e9f6e,#34d399)' : rate >= 40 ? 'linear-gradient(90deg,#f59e0b,#fcd34d)' : 'linear-gradient(90deg,#dc2626,#f87171)' }}></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminTracking;
