import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminLayout } from '../../components/shared/Layout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="User Management">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-1">Registered Users</h5>
          <p className="text-muted small mb-0">{users.length} total users</p>
        </div>
        <div style={{ width: 280 }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
            <input className="form-control border-start-0" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-danger" /></div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card-custom overflow-hidden">
              <table className="table table-custom mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Enrolled</th>
                    <th>Completed</th>
                    <th>Certificates</th>
                    <th>Jobs Applied</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => {
                    const enrolled = u.enrolledCourses?.length || 0;
                    const completed = u.enrolledCourses?.filter(ec => ec.completed)?.length || 0;
                    const certs = u.certificates?.length || 0;
                    const apps = u.appliedJobs?.length || 0;
                    return (
                      <tr key={u._id} style={{ cursor: 'pointer', background: selected?._id === u._id ? '#ebf5ff' : '' }} onClick={() => setSelected(u)}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
                              {u.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold small">{u.name}</div>
                              <div className="text-muted" style={{ fontSize: 11 }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{enrolled}</td>
                        <td>{completed}</td>
                        <td>{certs}</td>
                        <td>{apps}</td>
                        <td><i className="bi bi-chevron-right text-muted"></i></td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-muted py-4">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-5">
            {selected ? (
              <div className="card-custom p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="avatar" style={{ width: 52, height: 52, fontSize: 20 }}>
                    {selected.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-bold">{selected.name}</div>
                    <div className="text-muted small">{selected.email}</div>
                    {selected.location && <div className="text-muted" style={{ fontSize: 12 }}><i className="bi bi-geo-alt me-1"></i>{selected.location}</div>}
                  </div>
                </div>
                <div className="row g-2 mb-4">
                  {[
                    { label: 'Enrolled', value: selected.enrolledCourses?.length || 0, color: '#1a56db' },
                    { label: 'Completed', value: selected.enrolledCourses?.filter(e => e.completed)?.length || 0, color: '#0e9f6e' },
                    { label: 'Certificates', value: selected.certificates?.length || 0, color: '#d97706' },
                    { label: 'Applications', value: selected.appliedJobs?.length || 0, color: '#7c3aed' },
                  ].map((s, i) => (
                    <div key={i} className="col-6">
                      <div className="text-center p-2 rounded" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {selected.skills?.length > 0 && (
                  <div className="mb-3">
                    <div className="fw-semibold small mb-2">Skills</div>
                    <div className="d-flex flex-wrap gap-1">
                      {selected.skills.map((s, i) => <span key={i} className="badge" style={{ background: '#ebf5ff', color: '#1a56db' }}>{s}</span>)}
                    </div>
                  </div>
                )}

                {selected.enrolledCourses?.length > 0 && (
                  <div>
                    <div className="fw-semibold small mb-2">Enrolled Courses</div>
                    {selected.enrolledCourses.map((ec, i) => (
                      <div key={i} className="d-flex align-items-center justify-content-between p-2 mb-1 rounded" style={{ background: '#f9fafb' }}>
                        <span className="small text-truncate">{ec.course?.title || 'Course'}</span>
                        {ec.completed ? <span className="badge bg-success" style={{ fontSize: 10 }}>Done</span> : <span className="text-muted small">{ec.progress || 0}%</span>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-3 border-top">
                  <div className="text-muted small">Joined: {new Date(selected.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ) : (
              <div className="card-custom p-5 text-center">
                <div style={{ fontSize: 48 }}>👤</div>
                <p className="text-muted mt-3 small">Click a user to see their details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
