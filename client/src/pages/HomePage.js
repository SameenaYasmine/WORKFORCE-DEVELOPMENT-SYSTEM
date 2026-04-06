import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🎓', title: 'Expert Courses', desc: 'Access professionally curated courses across technology, business, and data science.' },
  { icon: '📊', title: 'Track Progress', desc: 'Monitor your learning journey with detailed progress tracking and analytics.' },
  { icon: '🏆', title: 'Earn Certificates', desc: 'Receive verified certificates upon completing courses to showcase your skills.' },
  { icon: '💼', title: 'Job Opportunities', desc: 'Connect with top employers and apply directly to relevant job openings.' },
];

const HomePage = () => {
  return (
    <div className="home-hero d-flex flex-column">
      {/* Nav */}
      <nav className="d-flex align-items-center justify-content-between px-5 py-4" style={{ position: 'relative', zIndex: 10 }}>
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #1a56db, #7c3aed)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-mortarboard-fill text-white" style={{ fontSize: 20 }}></i>
          </div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, fontFamily: 'Space Grotesk' }}>WorkforceDev</span>
        </div>
        <div className="d-flex gap-3">
          <Link to="/login" className="btn btn-outline-light btn-sm px-4" style={{ borderRadius: 8, fontWeight: 600 }}>Login</Link>
          <Link to="/register" className="btn btn-light btn-sm px-4" style={{ borderRadius: 8, fontWeight: 600, color: '#1a56db' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-fill d-flex align-items-center justify-content-center text-center px-4" style={{ position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 720 }}>
          <div className="d-inline-flex align-items-center gap-2 px-4 py-2 mb-4" style={{ background: 'rgba(26,86,219,0.2)', borderRadius: 30, border: '1px solid rgba(26,86,219,0.4)' }}>
            <span style={{ width: 8, height: 8, background: '#0e9f6e', borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>Your Career Development Platform</span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            Workforce<br />
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Development System</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Empower your workforce through structured learning, skill certification, and career opportunities — all in one platform.
          </p>

          <div className="d-flex gap-4 justify-content-center flex-wrap">
            <Link to="/login?role=user" className="d-flex align-items-center gap-3 px-5 py-3 text-decoration-none" style={{ background: '#1a56db', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: 15 }}>
              <i className="bi bi-person-fill" style={{ fontSize: 20 }}></i>
              <div className="text-start">
                <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 500 }}>LEARNER</div>
                <div>User Login</div>
              </div>
            </Link>
            <Link to="/login?role=admin" className="d-flex align-items-center gap-3 px-5 py-3 text-decoration-none" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: 15, border: '1px solid rgba(255,255,255,0.2)' }}>
              <i className="bi bi-shield-fill" style={{ fontSize: 20 }}></i>
              <div className="text-start">
                <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 500 }}>ADMINISTRATOR</div>
                <div>Admin Login</div>
              </div>
            </Link>
          </div>

          <p className="mt-4" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            New here? <Link to="/register" style={{ color: '#60a5fa', fontWeight: 600 }}>Create a free account</Link>
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="px-5 pb-5" style={{ position: 'relative', zIndex: 5 }}>
        <div className="row g-3 justify-content-center" style={{ maxWidth: 900, margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i} className="col-6 col-md-3">
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
