import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserLayout } from '../../components/shared/Layout';
import { useAuth } from '../../context/AuthContext';

const CertificatesPage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/users/dashboard').then(r => setUserData(r.data)).finally(() => setLoading(false));
  }, []);

  const downloadCertificate = async (cert) => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const w = doc.internal.pageSize.getWidth();
      const h = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, w, h, 'F');

      // Gold border
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(3);
      doc.rect(10, 10, w - 20, h - 20);
      doc.setLineWidth(1);
      doc.rect(14, 14, w - 28, h - 28);

      // Header
      doc.setTextColor(255, 215, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('WORKFORCE DEVELOPMENT SYSTEM', w / 2, 35, { align: 'center' });

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.text('Certificate of Completion', w / 2, 60, { align: 'center' });

      // Divider
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(0.5);
      doc.line(50, 68, w - 50, 68);

      // Body
      doc.setFontSize(14);
      doc.setTextColor(200, 200, 200);
      doc.text('This is to certify that', w / 2, 85, { align: 'center' });

      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bolditalic');
      doc.text(userData?.name || 'Student', w / 2, 105, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(200, 200, 200);
      doc.text('has successfully completed the course', w / 2, 120, { align: 'center' });

      doc.setFontSize(22);
      doc.setTextColor(255, 215, 0);
      doc.setFont('helvetica', 'bold');
      const courseTitle = cert.course?.title || 'Course';
      doc.text(courseTitle, w / 2, 138, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(160, 160, 160);
      doc.text(`Issued on: ${new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, w / 2, 155, { align: 'center' });
      doc.text(`Certificate ID: ${cert.certificateId || 'WDS-' + Date.now()}`, w / 2, 163, { align: 'center' });

      // Signature line
      doc.setDrawColor(100, 100, 100);
      doc.line(w / 2 - 50, 175, w / 2 + 50, 175);
      doc.setFontSize(11);
      doc.setTextColor(180, 180, 180);
      doc.text('Platform Director', w / 2, 181, { align: 'center' });
      doc.text('WorkforceDev Platform', w / 2, 187, { align: 'center' });

      doc.save(`Certificate_${courseTitle.replace(/\s+/g, '_')}.pdf`);
      toast.success('Certificate downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate certificate');
    }
  };

  if (loading) return <UserLayout title="My Certificates"><div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div></UserLayout>;

  const certs = userData?.certificates || [];

  return (
    <UserLayout title="My Certificates">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-1">My Certificates</h5>
          <p className="text-muted small mb-0">{certs.length} certificate{certs.length !== 1 ? 's' : ''} earned</p>
        </div>
      </div>

      {certs.length === 0 ? (
        <div className="card-custom p-5 text-center">
          <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
          <h5 className="fw-bold">No Certificates Yet</h5>
          <p className="text-muted">Complete courses to earn your certificates and showcase your skills.</p>
          <a href="/courses" className="btn btn-primary mt-2">Browse Courses</a>
        </div>
      ) : (
        <div className="row g-4">
          {certs.map((cert, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="certificate-card">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span style={{ fontSize: 36 }}>🏅</span>
                  <span className="badge bg-warning text-dark" style={{ fontSize: 10 }}>VERIFIED</span>
                </div>
                <h6 className="fw-bold mb-1">Certificate of Completion</h6>
                <div className="fw-bold mb-2" style={{ color: '#d97706', fontSize: 15 }}>{cert.course?.title || 'Course'}</div>
                <div className="text-muted small mb-1">Awarded to</div>
                <div className="fw-bold mb-3" style={{ fontSize: 17 }}>{userData?.name}</div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted" style={{ fontSize: 11 }}>Issued on</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{new Date(cert.issuedAt).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => downloadCertificate(cert)} className="btn btn-sm btn-warning text-dark fw-bold">
                    <i className="bi bi-download me-1"></i>Download PDF
                  </button>
                </div>
                {cert.certificateId && (
                  <div className="mt-2 pt-2 border-top" style={{ borderColor: '#fbbf24 !important' }}>
                    <div className="text-muted" style={{ fontSize: 10 }}>ID: {cert.certificateId}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  );
};

export default CertificatesPage;
