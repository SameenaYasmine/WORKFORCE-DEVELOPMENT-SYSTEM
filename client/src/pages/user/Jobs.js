import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserLayout } from '../../components/shared/Layout';
import { useAuth } from '../../context/AuthContext';

const typeColors = { 'Full-time': 'bg-primary', 'Part-time': 'bg-info text-dark', 'Contract': 'bg-warning text-dark', 'Remote': 'bg-success', 'Internship': 'bg-secondary' };

const Jobs = () => {
  const { user, refreshUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('/api/jobs').then(r => { setJobs(r.data); if (r.data.length > 0) setSelected(r.data[0]); }).finally(() => setLoading(false));
  }, []);

  const hasApplied = (jobId) => user?.appliedJobs?.some(aj => aj.job === jobId || aj.job?._id === jobId);

  const handleApply = async () => {
    setApplying(true);
    try {
      await axios.post(`/api/users/apply-job/${applyModal}`, { coverLetter });
      toast.success('Application submitted!');
      refreshUser();
      setApplyModal(null);
      setCoverLetter('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const types = ['All', ...new Set(jobs.map(j => j.type))];
  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filter === 'All' || j.type === filter);
  });

  return (
    <UserLayout title="Job Opportunities">
      {/* Filter Bar */}
      <div className="card-custom p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input className="form-control border-start-0" placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-6 d-flex gap-2 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-outline-secondary'}`} style={{ borderRadius: 20 }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-4">
          {/* Job list */}
          <div className="col-lg-5">
            {filtered.map(job => (
              <div key={job._id} onClick={() => setSelected(job)} className="card-custom p-3 mb-3 cursor-pointer" style={{ borderColor: selected?._id === job._id ? '#1a56db' : '#e5e7eb', cursor: 'pointer', background: selected?._id === job._id ? '#ebf5ff' : '#fff' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-bold">{job.title}</div>
                    <div className="text-muted small">{job.company}</div>
                  </div>
                  {hasApplied(job._id) && <span className="badge bg-success" style={{ fontSize: 10 }}>Applied</span>}
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <span className={`badge badge-level ${typeColors[job.type] || 'bg-secondary'}`}>{job.type}</span>
                  {job.location && <span className="badge" style={{ background: '#f3f4f6', color: '#6b7280', fontWeight: 500 }}><i className="bi bi-geo-alt me-1"></i>{job.location}</span>}
                  {job.salary && <span className="badge" style={{ background: '#f0fdf4', color: '#0e9f6e', fontWeight: 500 }}>{job.salary}</span>}
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-5"><div style={{ fontSize: 48 }}>💼</div><p className="text-muted mt-2">No jobs found.</p></div>}
          </div>

          {/* Job detail */}
          <div className="col-lg-7">
            {selected ? (
              <div className="card-custom p-4 sticky-top" style={{ top: 80 }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4 className="fw-bold mb-1">{selected.title}</h4>
                    <div className="text-muted">{selected.company}</div>
                  </div>
                  <div className="d-flex gap-2">
                    <span className={`badge badge-level ${typeColors[selected.type] || 'bg-secondary'}`}>{selected.type}</span>
                  </div>
                </div>

                <div className="d-flex gap-3 mb-4 flex-wrap">
                  {selected.location && <span className="text-muted small"><i className="bi bi-geo-alt me-1 text-primary"></i>{selected.location}</span>}
                  {selected.salary && <span className="text-muted small"><i className="bi bi-cash me-1 text-success"></i>{selected.salary}</span>}
                  {selected.deadline && <span className="text-muted small"><i className="bi bi-calendar me-1 text-danger"></i>Deadline: {new Date(selected.deadline).toLocaleDateString()}</span>}
                </div>

                <h6 className="fw-bold mb-2">Job Description</h6>
                <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>{selected.description}</p>

                {selected.requirements?.length > 0 && (
                  <>
                    <h6 className="fw-bold mb-2">Requirements</h6>
                    <ul className="list-unstyled mb-4">
                      {selected.requirements.map((r, i) => (
                        <li key={i} className="d-flex gap-2 mb-2">
                          <i className="bi bi-check-circle-fill text-success mt-1" style={{ fontSize: 14, flexShrink: 0 }}></i>
                          <span className="small">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {selected.skills?.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-2">Skills Required</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selected.skills.map((s, i) => <span key={i} className="badge" style={{ background: '#ebf5ff', color: '#1a56db', fontWeight: 500 }}>{s}</span>)}
                    </div>
                  </div>
                )}

                {hasApplied(selected._id) ? (
                  <div className="alert alert-success border-0 mb-0" style={{ borderRadius: 10 }}>
                    <i className="bi bi-check-circle-fill me-2"></i>You have already applied for this position.
                  </div>
                ) : (
                  <button onClick={() => setApplyModal(selected._id)} className="btn btn-primary px-4">
                    <i className="bi bi-send me-2"></i>Apply Now
                  </button>
                )}
              </div>
            ) : (
              <div className="card-custom p-5 text-center">
                <div style={{ fontSize: 60 }}>💼</div>
                <h5 className="mt-3">Select a job to view details</h5>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyModal && (
        <div className="modal d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="card-custom p-4" style={{ width: '100%', maxWidth: 500 }}>
            <h5 className="fw-bold mb-1">Apply for Position</h5>
            <p className="text-muted small mb-4">{selected?.title} at {selected?.company}</p>
            <div className="mb-4">
              <label className="form-label small fw-semibold">Cover Letter (Optional)</label>
              <textarea className="form-control" rows={5} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Introduce yourself and explain why you're a great fit..." />
            </div>
            <div className="d-flex gap-2">
              <button onClick={handleApply} disabled={applying} className="btn btn-primary flex-fill">
                {applying ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                Submit Application
              </button>
              <button onClick={() => { setApplyModal(null); setCoverLetter(''); }} className="btn btn-outline-secondary flex-fill">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default Jobs;
