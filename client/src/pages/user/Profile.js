import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserLayout } from '../../components/shared/Layout';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', bio: '', location: '', skills: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', bio: user.bio || '', location: user.location || '', skills: Array.isArray(user.skills) ? user.skills.join(', ') : '' });
    }
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/users/profile', { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
      toast.success('Profile updated!');
      refreshUser();
      setEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

  return (
    <UserLayout title="My Profile">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card-custom p-4 text-center">
            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#1a56db,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#fff', fontWeight: 800, margin: '0 auto 16px' }}>{initials}</div>
            <h5 className="mb-1">{user?.name}</h5>
            <p className="text-muted small mb-3">{user?.email}</p>
            <span className="badge bg-primary">{user?.role?.toUpperCase()}</span>
            <hr />
            <div className="text-start">
              {user?.location && <div className="d-flex align-items-center gap-2 mb-2 small"><i className="bi bi-geo-alt text-muted"></i> {user.location}</div>}
              {user?.phone && <div className="d-flex align-items-center gap-2 mb-2 small"><i className="bi bi-telephone text-muted"></i> {user.phone}</div>}
              <div className="d-flex align-items-center gap-2 mb-2 small"><i className="bi bi-calendar text-muted"></i> Joined {new Date(user?.createdAt).toLocaleDateString()}</div>
            </div>
            {Array.isArray(user?.skills) && user.skills.length > 0 && (
              <div className="mt-3 text-start">
                <div className="fw-semibold small mb-2">Skills</div>
                <div className="d-flex flex-wrap gap-1">
                  {user.skills.map((s, i) => <span key={i} className="badge" style={{ background: '#ebf5ff', color: '#1a56db', fontWeight: 500 }}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-8">
          <div className="card-custom p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="mb-0 fw-bold">Personal Information</h6>
              {!editing && <button onClick={() => setEditing(true)} className="btn btn-sm btn-outline-primary"><i className="bi bi-pencil me-1"></i>Edit</button>}
            </div>

            {!editing ? (
              <div className="row g-3">
                {[['Full Name', user?.name], ['Email', user?.email], ['Phone', user?.phone || '-'], ['Location', user?.location || '-']].map(([label, value]) => (
                  <div key={label} className="col-sm-6">
                    <div className="small text-muted mb-1">{label}</div>
                    <div className="fw-semibold">{value}</div>
                  </div>
                ))}
                <div className="col-12">
                  <div className="small text-muted mb-1">Bio</div>
                  <div>{user?.bio || 'No bio added yet.'}</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">Email</label>
                    <input name="email" value={form.email} disabled className="form-control" />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="form-control" placeholder="+1 234 567 890" />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">Location</label>
                    <input name="location" value={form.location} onChange={handleChange} className="form-control" placeholder="City, Country" />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Bio</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} className="form-control" rows={3} placeholder="Tell us about yourself..." />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Skills (comma-separated)</label>
                    <input name="skills" value={form.skills} onChange={handleChange} className="form-control" placeholder="React, Python, Project Management" />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" disabled={loading} className="btn btn-primary">{loading ? <span className="spinner-border spinner-border-sm me-1" /> : null}Save Changes</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn btn-outline-secondary">Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Activity summary */}
          <div className="card-custom p-4 mt-4">
            <h6 className="fw-bold mb-3">Learning Summary</h6>
            <div className="row g-3">
              {[
                { icon: '📚', label: 'Enrolled', value: user?.enrolledCourses?.length || 0 },
                { icon: '✅', label: 'Completed', value: user?.enrolledCourses?.filter(e => e.completed)?.length || 0 },
                { icon: '🏆', label: 'Certificates', value: user?.certificates?.length || 0 },
                { icon: '💼', label: 'Applications', value: user?.appliedJobs?.length || 0 },
              ].map((s, i) => (
                <div key={i} className="col-6 col-sm-3 text-center">
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1a56db' }}>{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
