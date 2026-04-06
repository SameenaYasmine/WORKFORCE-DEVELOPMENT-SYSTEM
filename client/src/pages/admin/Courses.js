import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminLayout } from '../../components/shared/Layout';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchCourses = () => {
    setLoading(true);
    axios.get('/api/courses').then(r => setCourses(r.data)).finally(() => setLoading(false));
  };
  useEffect(fetchCourses, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const levelBadge = { Beginner: 'bg-success', Intermediate: 'bg-warning text-dark', Advanced: 'bg-danger' };

  return (
    <AdminLayout title="Course Management">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-1">Manage Courses</h5>
          <p className="text-muted small mb-0">{courses.length} courses available</p>
        </div>
        <Link to="/admin/courses/new" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Add Course
        </Link>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-danger" /></div>
      ) : courses.length === 0 ? (
        <div className="card-custom p-5 text-center">
          <div style={{ fontSize: 60 }}>📚</div>
          <h5 className="mt-3">No courses yet</h5>
          <p className="text-muted">Add your first course to get started.</p>
          <Link to="/admin/courses/new" className="btn btn-primary mt-2">Create First Course</Link>
        </div>
      ) : (
        <div className="card-custom overflow-hidden">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Level</th>
                <th>Modules</th>
                <th>Enrolled</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id}>
                  <td>
                    <div className="fw-semibold">{c.title}</div>
                    <div className="text-muted small">{c.duration}</div>
                  </td>
                  <td><span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>{c.category}</span></td>
                  <td><span className={`badge ${levelBadge[c.level] || 'bg-secondary'}`}>{c.level}</span></td>
                  <td>{c.modules?.length || 0}</td>
                  <td>{c.enrollmentCount || 0}</td>
                  <td>{c.completionCount || 0}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/admin/courses/${c._id}/edit`} className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id} className="btn btn-sm btn-outline-danger">
                        {deleting === c._id ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-trash"></i>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCourses;
