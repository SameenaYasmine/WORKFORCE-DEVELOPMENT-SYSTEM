import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserLayout } from '../../components/shared/Layout';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/users/dashboard').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <UserLayout title="Dashboard"><div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div></UserLayout>;

  const enrolled = data?.enrolledCourses?.length || 0;
  const completed = data?.enrolledCourses?.filter(ec => ec.completed)?.length || 0;
  const inProgress = enrolled - completed;
  const certs = data?.certificates?.length || 0;
  const jobs = data?.appliedJobs?.length || 0;

  const stats = [
    { label: 'Enrolled Courses', value: enrolled, icon: 'bi-play-circle-fill', color: '#1a56db', bg: '#ebf5ff' },
    { label: 'In Progress', value: inProgress, icon: 'bi-clock-fill', color: '#d97706', bg: '#fffbeb' },
    { label: 'Completed', value: completed, icon: 'bi-check-circle-fill', color: '#0e9f6e', bg: '#f0fdf4' },
    { label: 'Certificates', value: certs, icon: 'bi-award-fill', color: '#7c3aed', bg: '#f5f3ff' },
  ];

  const inProgressCourses = data?.enrolledCourses?.filter(ec => !ec.completed) || [];
  const recentCompleted = data?.enrolledCourses?.filter(ec => ec.completed).slice(0, 3) || [];

  return (
    <UserLayout title="My Dashboard">
      <div className="mb-4">
        <h4 className="mb-1">Welcome back, <span style={{ color: '#1a56db' }}>{data?.name?.split(' ')[0]}</span>! 👋</h4>
        <p className="text-muted mb-0">Here's your learning overview today.</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                <i className={`bi ${s.icon}`}></i>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* In Progress Courses */}
        <div className="col-lg-7">
          <div className="card-custom p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0 fw-bold">Courses In Progress</h6>
              <Link to="/courses" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            {inProgressCourses.length === 0 ? (
              <div className="text-center py-4">
                <div style={{ fontSize: 40 }}>📚</div>
                <p className="text-muted mt-2 mb-0 small">No courses in progress.</p>
                <Link to="/courses" className="btn btn-primary btn-sm mt-3">Browse Courses</Link>
              </div>
            ) : (
              inProgressCourses.map((ec, i) => (
                <div key={i} className="d-flex align-items-center gap-3 p-3 mb-2 rounded" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#667eea,#764ba2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📖</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="fw-semibold small text-truncate">{ec.course?.title || 'Course'}</div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <div className="progress-bar-custom flex-fill">
                        <div className="progress-bar-fill" style={{ width: `${ec.progress || 0}%` }}></div>
                      </div>
                      <span className="text-muted" style={{ fontSize: 12, flexShrink: 0 }}>{ec.progress || 0}%</span>
                    </div>
                  </div>
                  <Link to={`/courses/${ec.course?._id}`} className="btn btn-sm btn-primary">Continue</Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="col-lg-5">
          {/* Recent Certificates */}
          <div className="card-custom p-4 mb-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0 fw-bold">Recent Certificates</h6>
              <Link to="/certificates" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            {certs === 0 ? (
              <div className="text-center py-3">
                <div style={{ fontSize: 32 }}>🏆</div>
                <p className="text-muted mt-2 mb-0 small">Complete courses to earn certificates.</p>
              </div>
            ) : (
              data?.certificates?.slice(0, 3).map((c, i) => (
                <div key={i} className="d-flex align-items-center gap-3 p-2 mb-1 rounded" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <span style={{ fontSize: 22 }}>🥇</span>
                  <div>
                    <div className="fw-semibold small">{c.course?.title || 'Course'}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{new Date(c.issuedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Applied Jobs */}
          <div className="card-custom p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0 fw-bold">Applied Jobs</h6>
              <Link to="/jobs" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            {jobs === 0 ? (
              <div className="text-center py-3">
                <div style={{ fontSize: 32 }}>💼</div>
                <p className="text-muted mt-2 mb-0 small">No job applications yet.</p>
                <Link to="/jobs" className="btn btn-outline-secondary btn-sm mt-2">Explore Jobs</Link>
              </div>
            ) : (
              data?.appliedJobs?.slice(0, 3).map((aj, i) => (
                <div key={i} className="d-flex align-items-center gap-3 p-2 mb-1 rounded" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: 22 }}>💼</span>
                  <div>
                    <div className="fw-semibold small">{aj.job?.title || 'Position'}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{aj.job?.company}</div>
                  </div>
                  <span className={`badge ms-auto ${aj.status === 'accepted' ? 'bg-success' : aj.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: 10 }}>{aj.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
