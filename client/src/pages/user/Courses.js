import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserLayout } from '../../components/shared/Layout';
import { useAuth } from '../../context/AuthContext';

const categoryEmojis = { Technology: '💻', 'Data Science': '📊', Business: '📈', Design: '🎨', General: '📚' };
const levelColors = { Beginner: 'bg-success', Intermediate: 'bg-warning text-dark', Advanced: 'bg-danger' };

const Courses = () => {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    axios.get('/api/courses').then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  const isEnrolled = (courseId) => user?.enrolledCourses?.some(ec => ec.course === courseId || ec.course?._id === courseId);
  const getProgress = (courseId) => {
    const ec = user?.enrolledCourses?.find(e => (e.course === courseId || e.course?._id === courseId));
    return ec?.progress || 0;
  };
  const isCompleted = (courseId) => {
    const ec = user?.enrolledCourses?.find(e => (e.course === courseId || e.course?._id === courseId));
    return ec?.completed || false;
  };

  const handleEnroll = async (courseId, e) => {
    e.preventDefault();
    setEnrolling(courseId);
    try {
      await axios.post(`/api/users/enroll/${courseId}`);
      toast.success('Enrolled successfully!');
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(null);
    }
  };

  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <UserLayout title="Browse Courses">
      {/* Filters */}
      <div className="card-custom p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input type="text" className="form-control border-start-0" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-6 d-flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`} style={{ borderRadius: 20 }}>
                {cat !== 'All' && categoryEmojis[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <>
          <p className="text-muted small mb-3">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="row g-4">
            {filtered.map(course => {
              const enrolled = isEnrolled(course._id);
              const progress = getProgress(course._id);
              const completed = isCompleted(course._id);
              return (
                <div key={course._id} className="col-md-6 col-lg-4">
                  <Link to={`/courses/${course._id}`} className="text-decoration-none">
                    <div className="card-custom h-100">
                      <div className="course-thumb" style={{ background: `linear-gradient(135deg, hsl(${course.title.length * 30 % 360}, 60%, 40%), hsl(${(course.title.length * 50 + 60) % 360}, 70%, 30%))` }}>
                        <span>{categoryEmojis[course.category] || '📚'}</span>
                      </div>
                      <div className="p-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className={`badge badge-level ${levelColors[course.level] || 'bg-secondary'}`}>{course.level}</span>
                          <span className="badge" style={{ background: '#f3f4f6', color: '#6b7280', fontWeight: 500 }}>{course.category}</span>
                        </div>
                        <h6 className="fw-bold mb-2">{course.title}</h6>
                        <p className="text-muted small mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
                        <div className="d-flex gap-3 text-muted small mb-3">
                          <span><i className="bi bi-collection me-1"></i>{course.modules?.length || 0} modules</span>
                          <span><i className="bi bi-clock me-1"></i>{course.duration}</span>
                          <span><i className="bi bi-people me-1"></i>{course.enrollmentCount}</span>
                        </div>
                        {enrolled && (
                          <div className="mb-3">
                            <div className="d-flex justify-content-between small mb-1">
                              <span className="text-muted">{completed ? '✅ Completed' : 'Progress'}</span>
                              <span className="fw-semibold">{progress}%</span>
                            </div>
                            <div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: `${progress}%` }}></div></div>
                          </div>
                        )}
                        {!enrolled ? (
                          <button onClick={(e) => handleEnroll(course._id, e)} disabled={enrolling === course._id} className="btn btn-primary btn-sm w-100">
                            {enrolling === course._id ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                            Enroll Now
                          </button>
                        ) : (
                          <span className={`btn btn-sm w-100 ${completed ? 'btn-success' : 'btn-outline-primary'}`}>
                            {completed ? '✅ View Certificate' : '▶ Continue Learning'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-5">
              <div style={{ fontSize: 48 }}>🔍</div>
              <h5 className="mt-3">No courses found</h5>
              <p className="text-muted">Try adjusting your search or filter.</p>
            </div>
          )}
        </>
      )}
    </UserLayout>
  );
};

export default Courses;
