import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminLayout } from '../../components/shared/Layout';

const emptyModule = { title: '', description: '', content: '', videoUrl: '', duration: 30, order: 1 };

const AdminCourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [course, setCourse] = useState({ title: '', description: '', category: 'Technology', level: 'Beginner', duration: '', instructor: 'Admin', tags: '', modules: [] });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleForm, setModuleForm] = useState(emptyModule);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/courses/${id}`).then(r => {
        const c = r.data;
        setCourse({ ...c, tags: Array.isArray(c.tags) ? c.tags.join(', ') : '' });
      }).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = e => setCourse({ ...course, [e.target.name]: e.target.value });
  const handleModuleChange = e => setModuleForm({ ...moduleForm, [e.target.name]: e.target.value });

  const handleSaveCourse = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...course, tags: course.tags ? course.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (isEdit) {
        await axios.put(`/api/courses/${id}`, payload);
        toast.success('Course updated!');
      } else {
        const res = await axios.post('/api/courses', payload);
        toast.success('Course created!');
        navigate(`/admin/courses/${res.data._id}/edit`);
        return;
      }
      navigate('/admin/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const openAddModule = () => { setEditingModule(null); setModuleForm({ ...emptyModule, order: (course.modules?.length || 0) + 1 }); setShowModuleForm(true); };
  const openEditModule = (mod) => { setEditingModule(mod._id); setModuleForm({ title: mod.title, description: mod.description, content: mod.content, videoUrl: mod.videoUrl || '', duration: mod.duration, order: mod.order }); setShowModuleForm(true); };

  const handleSaveModule = async () => {
    if (!moduleForm.title) return toast.error('Module title required');
    try {
      let res;
      if (editingModule) {
        res = await axios.put(`/api/courses/${id}/modules/${editingModule}`, moduleForm);
      } else {
        res = await axios.post(`/api/courses/${id}/modules`, moduleForm);
      }
      setCourse(prev => ({ ...prev, modules: res.data.modules }));
      toast.success(editingModule ? 'Module updated!' : 'Module added!');
      setShowModuleForm(false);
      setEditingModule(null);
    } catch { toast.error('Failed to save module'); }
  };

  const handleDeleteModule = async (modId) => {
    if (!window.confirm('Delete this module?')) return;
    try {
      const res = await axios.delete(`/api/courses/${id}/modules/${modId}`);
      setCourse(prev => ({ ...prev, modules: res.data.modules }));
      toast.success('Module deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <AdminLayout title="Edit Course"><div className="d-flex justify-content-center py-5"><div className="spinner-border text-danger" /></div></AdminLayout>;

  return (
    <AdminLayout title={isEdit ? 'Edit Course' : 'New Course'}>
      <div className="row g-4">
        {/* Course Form */}
        <div className="col-lg-7">
          <div className="card-custom p-4">
            <h6 className="fw-bold mb-4">Course Information</h6>
            <form onSubmit={handleSaveCourse}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Course Title *</label>
                <input name="title" value={course.title} onChange={handleChange} className="form-control" required placeholder="e.g. Web Development Fundamentals" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Description *</label>
                <textarea name="description" value={course.description} onChange={handleChange} className="form-control" rows={4} required placeholder="Describe what students will learn..." />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-4">
                  <label className="form-label small fw-semibold">Category</label>
                  <select name="category" value={course.category} onChange={handleChange} className="form-select">
                    {['Technology', 'Data Science', 'Business', 'Design', 'General'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-sm-4">
                  <label className="form-label small fw-semibold">Level</label>
                  <select name="level" value={course.level} onChange={handleChange} className="form-select">
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="col-sm-4">
                  <label className="form-label small fw-semibold">Duration</label>
                  <input name="duration" value={course.duration} onChange={handleChange} className="form-control" placeholder="e.g. 8 weeks" />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold">Instructor</label>
                  <input name="instructor" value={course.instructor} onChange={handleChange} className="form-control" />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold">Tags (comma-separated)</label>
                  <input name="tags" value={course.tags} onChange={handleChange} className="form-control" placeholder="react, javascript" />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button type="submit" disabled={saving} className="btn btn-primary px-4">
                  {saving ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                  {isEdit ? 'Update Course' : 'Create Course'}
                </button>
                <button type="button" onClick={() => navigate('/admin/courses')} className="btn btn-outline-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>

        {/* Modules */}
        <div className="col-lg-5">
          <div className="card-custom p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0">Modules ({course.modules?.length || 0})</h6>
              {isEdit && (
                <button onClick={openAddModule} className="btn btn-sm btn-primary">
                  <i className="bi bi-plus me-1"></i>Add Module
                </button>
              )}
            </div>

            {!isEdit && (
              <div className="alert alert-info border-0" style={{ background: '#ebf5ff', borderRadius: 10 }}>
                <i className="bi bi-info-circle me-2"></i>Save the course first to add modules.
              </div>
            )}

            {course.modules?.length === 0 && isEdit && (
              <div className="text-center py-4">
                <div style={{ fontSize: 36 }}>📄</div>
                <p className="text-muted small mt-2">No modules yet. Add your first module.</p>
              </div>
            )}

            {course.modules?.map((mod, i) => (
              <div key={mod._id} className="module-item">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: 28, height: 28, background: '#1a56db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div className="fw-semibold small">{mod.title}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{mod.duration} min · {mod.description?.slice(0, 40)}{mod.description?.length > 40 ? '...' : ''}</div>
                  </div>
                  <div className="d-flex gap-1">
                    <button onClick={() => openEditModule(mod)} className="btn btn-sm btn-outline-primary p-1" style={{ lineHeight: 1 }}><i className="bi bi-pencil" style={{ fontSize: 12 }}></i></button>
                    <button onClick={() => handleDeleteModule(mod._id)} className="btn btn-sm btn-outline-danger p-1" style={{ lineHeight: 1 }}><i className="bi bi-trash" style={{ fontSize: 12 }}></i></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Form Modal */}
      {showModuleForm && (
        <div className="modal d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, padding: 20 }}>
          <div className="card-custom p-4" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">{editingModule ? 'Edit Module' : 'Add Module'}</h5>
              <button onClick={() => setShowModuleForm(false)} className="btn btn-sm btn-outline-secondary"><i className="bi bi-x"></i></button>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Title *</label>
              <input name="title" value={moduleForm.title} onChange={handleModuleChange} className="form-control" placeholder="e.g. Introduction to HTML" />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Brief Description</label>
              <input name="description" value={moduleForm.description} onChange={handleModuleChange} className="form-control" placeholder="Short overview" />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Full Content</label>
              <textarea name="content" value={moduleForm.content} onChange={handleModuleChange} className="form-control" rows={6} placeholder="Full lesson content..." />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">Duration (minutes)</label>
                <input type="number" name="duration" value={moduleForm.duration} onChange={handleModuleChange} className="form-control" min={1} />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">Order</label>
                <input type="number" name="order" value={moduleForm.order} onChange={handleModuleChange} className="form-control" min={1} />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold">Video URL (optional)</label>
              <input name="videoUrl" value={moduleForm.videoUrl} onChange={handleModuleChange} className="form-control" placeholder="https://..." />
            </div>
            <div className="d-flex gap-2">
              <button onClick={handleSaveModule} className="btn btn-primary flex-fill">{editingModule ? 'Update Module' : 'Add Module'}</button>
              <button onClick={() => setShowModuleForm(false)} className="btn btn-outline-secondary flex-fill">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCourseEdit;
