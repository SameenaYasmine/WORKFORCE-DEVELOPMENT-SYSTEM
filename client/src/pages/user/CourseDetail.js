import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserLayout } from '../../components/shared/Layout';
import { useAuth } from '../../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    axios.get(`/api/courses/${id}`).then(r => {
      setCourse(r.data);
      if (r.data.modules?.length > 0) setActiveModule(r.data.modules[0]);
    }).finally(() => setLoading(false));
  }, [id]);

  const enrollment = user?.enrolledCourses?.find(ec => ec.course === id || ec.course?._id === id || ec.course === course?._id);
  const isEnrolled = !!enrollment;
  const completedModules = enrollment?.completedModules || [];

  const handleEnroll = async () => {
    try {
      await axios.post(`/api/users/enroll/${id}`);
      toast.success('Enrolled!');
      refreshUser();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleCompleteModule = async (moduleId) => {
    if (completedModules.includes(moduleId)) return;
    setCompleting(true);
    try {
      const res = await axios.post(`/api/users/complete-module/${id}/${moduleId}`);
      toast.success(res.data.message);
      refreshUser();
      if (res.data.completed) {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      toast.error('Failed to mark complete');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <UserLayout title="Course"><div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div></UserLayout>;
  if (!course) return <UserLayout title="Course"><div className="alert alert-danger">Course not found</div></UserLayout>;

  const isModuleCompleted = (mId) => completedModules.includes(mId) || completedModules.includes(mId?.toString());

  return (
    <UserLayout title={course.title}>
      <div className="row g-4">
        {/* Left: Module list */}
        <div className="col-lg-4">
          <div className="card-custom p-4 mb-3">
            <div style={{ height: 120, background: `linear-gradient(135deg, hsl(${course.title.length * 30 % 360}, 60%, 40%), hsl(${(course.title.length * 50 + 60) % 360}, 70%, 30%))`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, marginBottom: 16 }}>📖</div>
            <h5 className="fw-bold">{course.title}</h5>
            <p className="text-muted small">{course.description}</p>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-primary">{course.level}</span>
              <span className="badge bg-secondary">{course.category}</span>
              <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}><i className="bi bi-clock me-1"></i>{course.duration}</span>
            </div>
            <div className="text-muted small mb-3">
              <div><i className="bi bi-collection me-2"></i>{course.modules?.length} modules</div>
              <div><i className="bi bi-people me-2"></i>{course.enrollmentCount} enrolled</div>
              <div><i className="bi bi-person me-2"></i>Instructor: {course.instructor}</div>
            </div>
            {!isEnrolled ? (
              <button onClick={handleEnroll} className="btn btn-primary w-100">Enroll Now — Free</button>
            ) : enrollment?.completed ? (
              <div className="text-center">
                <div style={{ color: '#0e9f6e', fontWeight: 700, fontSize: 15 }}>✅ Course Completed!</div>
                <Link to="/certificates" className="btn btn-success btn-sm mt-2 w-100">View Certificate</Link>
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Progress</span><span className="fw-bold">{enrollment?.progress || 0}%</span>
                </div>
                <div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: `${enrollment?.progress || 0}%` }}></div></div>
              </div>
            )}
          </div>

          {/* Module list */}
          <div className="card-custom p-3">
            <h6 className="fw-bold mb-3 px-1">Course Modules</h6>
            {course.modules?.length === 0 && <p className="text-muted small px-1">No modules yet.</p>}
            {course.modules?.map((mod, i) => (
              <div key={mod._id} className={`module-item ${activeModule?._id === mod._id ? 'active' : ''} ${isModuleCompleted(mod._id) ? 'completed' : ''}`} onClick={() => setActiveModule(mod)}>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: isModuleCompleted(mod._id) ? '#0e9f6e' : activeModule?._id === mod._id ? '#1a56db' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {isModuleCompleted(mod._id) ? '✓' : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="fw-semibold small text-truncate">{mod.title}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{mod.duration} min</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content viewer */}
        <div className="col-lg-8">
          {activeModule ? (
            <div className="card-custom p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div style={{ width: 44, height: 44, background: '#ebf5ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📄</div>
                <div>
                  <h5 className="mb-0 fw-bold">{activeModule.title}</h5>
                  <span className="text-muted small"><i className="bi bi-clock me-1"></i>{activeModule.duration} minutes</span>
                </div>
                {isModuleCompleted(activeModule._id) && <span className="badge bg-success ms-auto">✓ Completed</span>}
              </div>

              {activeModule.description && (
                <div className="alert alert-info border-0 mb-4" style={{ background: '#ebf5ff', borderRadius: 10 }}>
                  <strong>Overview:</strong> {activeModule.description}
                </div>
              )}

              <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24, minHeight: 300, lineHeight: 1.8, fontSize: 15 }}>
                {activeModule.content || 'No content available for this module.'}
              </div>

              {activeModule.videoUrl && (
                <div className="mt-4">
                  <h6 className="fw-bold">Video Lesson</h6>
                  <a href={activeModule.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-play-circle me-2"></i>Watch Video
                  </a>
                </div>
              )}

              {isEnrolled && !isModuleCompleted(activeModule._id) && (
                <div className="mt-4 p-3 rounded" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-semibold">Ready to move on?</div>
                      <div className="text-muted small">Mark this module as complete to track your progress.</div>
                    </div>
                    <button onClick={() => handleCompleteModule(activeModule._id)} disabled={completing} className="btn btn-success">
                      {completing ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="bi bi-check-circle me-1"></i>}
                      Mark Complete
                    </button>
                  </div>
                </div>
              )}

              {/* Navigate modules */}
              <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                {(() => {
                  const idx = course.modules.findIndex(m => m._id === activeModule._id);
                  const prev = course.modules[idx - 1];
                  const next = course.modules[idx + 1];
                  return (<>
                    <button className="btn btn-outline-secondary btn-sm" disabled={!prev} onClick={() => prev && setActiveModule(prev)}>
                      <i className="bi bi-arrow-left me-1"></i>Previous
                    </button>
                    <span className="text-muted small align-self-center">{idx + 1} / {course.modules.length}</span>
                    <button className="btn btn-outline-primary btn-sm" disabled={!next} onClick={() => next && setActiveModule(next)}>
                      Next<i className="bi bi-arrow-right ms-1"></i>
                    </button>
                  </>);
                })()}
              </div>
            </div>
          ) : (
            <div className="card-custom p-5 text-center">
              <div style={{ fontSize: 60 }}>📖</div>
              <h5 className="mt-3">Select a module to start learning</h5>
              <p className="text-muted">Choose any module from the list on the left.</p>
              {!isEnrolled && <button onClick={handleEnroll} className="btn btn-primary mt-2">Enroll to Start</button>}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default CourseDetail;
