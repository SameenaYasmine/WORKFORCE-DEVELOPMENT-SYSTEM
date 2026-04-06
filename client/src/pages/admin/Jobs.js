import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminLayout } from '../../components/shared/Layout';

const emptyJob = { title: '', company: '', description: '', requirements: '', location: '', type: 'Full-time', salary: '', skills: '' };

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyJob);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchJobs = () => {
    setLoading(true);
    axios.get('/api/jobs').then(r => setJobs(r.data)).finally(() => setLoading(false));
  };
  useEffect(fetchJobs, []);

  const openAdd = () => { setEditingId(null); setForm(emptyJob); setShowModal(true); };
  const openEdit = (job) => {
    setEditingId(job._id);
    setForm({ ...job, requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '', skills: Array.isArray(job.skills) ? job.skills.join(', ') : '' });
    setShowModal(true);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.title || !form.company || !form.description) return toast.error('Title, company and description required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      if (editingId) {
        await axios.put(`/api/jobs/${editingId}`, payload);
        toast.success('Job updated!');
      } else {
        await axios.post('/api/jobs', payload);
        toast.success('Job posted!');
      }
      setShowModal(false);
      fetchJobs();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/jobs/${id}`);
      toast.success('Job deleted');
      fetchJobs();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const typeColors = { 'Full-time': 'bg-primary', 'Part-time': 'bg-info text-dark', 'Contract': 'bg-warning text-dark', 'Remote': 'bg-success', 'Internship': 'bg-secondary' };

  return (
    <AdminLayout title="Job Management">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-1">Job Opportunities</h5>
          <p className="text-muted small mb-0">{jobs.length} active postings</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><i className="bi bi-plus-circle me-2"></i>Post Job</button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-danger" /></div>
      ) : jobs.length === 0 ? (
        <div className="card-custom p-5 text-center">
          <div style={{ fontSize: 60 }}>💼</div>
          <h5 className="mt-3">No job postings yet</h5>
          <button onClick={openAdd} className="btn btn-primary mt-3">Post First Job</button>
        </div>
      ) : (
        <div className="row g-4">
          {jobs.map(job => (
            <div key={job._id} className="col-md-6">
              <div className="card-custom p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold mb-1">{job.title}</h6>
                    <div className="text-muted small">{job.company}</div>
                  </div>
                  <div className="d-flex gap-1">
                    <button onClick={() => openEdit(job)} className="btn btn-sm btn-outline-primary"><i className="bi bi-pencil"></i></button>
                    <button onClick={() => handleDelete(job._id)} disabled={deleting === job._id} className="btn btn-sm btn-outline-danger">
                      {deleting === job._id ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-trash"></i>}
                    </button>
                  </div>
                </div>
                <div className="d-flex gap-2 flex-wrap mb-3">
                  <span className={`badge badge-level ${typeColors[job.type] || 'bg-secondary'}`}>{job.type}</span>
                  {job.location && <span className="badge" style={{ background: '#f3f4f6', color: '#6b7280' }}><i className="bi bi-geo-alt me-1"></i>{job.location}</span>}
                  {job.salary && <span className="badge" style={{ background: '#f0fdf4', color: '#0e9f6e' }}>{job.salary}</span>}
                </div>
                <p className="text-muted small mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span className="text-muted small"><i className="bi bi-people me-1"></i>{job.applicants?.length || 0} applicants</span>
                  <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>{job.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Modal */}
      {showModal && (
        <div className="modal d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, padding: 20 }}>
          <div className="card-custom p-4" style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">{editingId ? 'Edit Job' : 'Post New Job'}</h5>
              <button onClick={() => setShowModal(false)} className="btn btn-sm btn-outline-secondary"><i className="bi bi-x"></i></button>
            </div>
            <div className="row g-3">
              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Job Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className="form-control" placeholder="Frontend Developer" />
              </div>
              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Company *</label>
                <input name="company" value={form.company} onChange={handleChange} className="form-control" placeholder="TechCorp" />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={3} placeholder="Job description..." />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Requirements (one per line)</label>
                <textarea name="requirements" value={form.requirements} onChange={handleChange} className="form-control" rows={4} placeholder="3+ years React experience&#10;Strong CSS skills" />
              </div>
              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="form-control" placeholder="Remote / City" />
              </div>
              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Job Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="form-select">
                  {['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Salary</label>
                <input name="salary" value={form.salary} onChange={handleChange} className="form-control" placeholder="$70k - $90k" />
              </div>
              <div className="col-sm-6">
                <label className="form-label small fw-semibold">Skills (comma-separated)</label>
                <input name="skills" value={form.skills} onChange={handleChange} className="form-control" placeholder="React, Python" />
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-fill">
                {saving ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                {editingId ? 'Update Job' : 'Post Job'}
              </button>
              <button onClick={() => setShowModal(false)} className="btn btn-outline-secondary flex-fill">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminJobs;
