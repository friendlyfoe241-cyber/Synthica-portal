import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import { supabase } from '../../lib/supabaseClient';

const ROLE_LABELS = {
  chapter_leader: 'Chapter Leader',
  lead_researcher: 'Lead Researcher',
  associate_researcher: 'Associate Researcher',
  independent_researcher: 'Independent Researcher',
  pending: 'Pending',
};

const ROLE_COLORS = {
  chapter_leader: '#2589ed',
  lead_researcher: '#FFD700',
  associate_researcher: '#78b4fb',
  independent_researcher: '#69aaec',
  pending: '#6B7280',
};

export default function DashboardShell({ children, activeTab }) {
  const { user, userProfile, logout, refreshProfile } = useUserAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleRoleSwitch = async (newRole) => {
    if (!user || switchingRole) return;
    setSwitchingRole(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      setShowRoleSwitcher(false);
    } catch (err) {
      console.error('Error switching role:', err);
      alert('Failed to switch role');
    } finally {
      setSwitchingRole(false);
    }
  };

  const role = userProfile?.role || 'pending';
  const roleLabel = ROLE_LABELS[role];
  const roleColor = ROLE_COLORS[role];

  return (
    <div className="ds-layout">
      {/* Sidebar */}
      <aside className={`ds-sidebar ${menuOpen ? 'ds-sidebar-open' : ''}`}>
        <div className="ds-sidebar-top">
          <Link to="/" className="ds-brand">
            <img src="/assets/logo/Synthica Logo.png" alt="Synthica" className="ds-brand-logo" />
            <span>Synthica</span>
          </Link>

          <div className="ds-user-card">
            <img
              src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/assets/logo/Synthica Preview Image (5).jpg'}
              alt={user?.user_metadata?.full_name || user?.email}
              className="ds-avatar"
            />
            <div className="ds-user-info">
              <p className="ds-user-name">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Researcher'}</p>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                  className="ds-role-badge"
                  style={{ 
                    background: `${roleColor}22`, 
                    color: roleColor, 
                    border: `1px solid ${roleColor}44`,
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '600'
                  }}
                >
                  {roleLabel} ▼
                </button>
                {showRoleSwitcher && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '0.5rem',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: '160px',
                    overflow: 'hidden'
                  }}>
                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleRoleSwitch(key)}
                        disabled={switchingRole || key === role}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          background: key === role ? `${ROLE_COLORS[key]}22` : 'transparent',
                          color: ROLE_COLORS[key],
                          border: 'none',
                          cursor: key === role ? 'default' : 'pointer',
                          fontWeight: key === role ? '700' : '500',
                          fontSize: '0.8rem',
                          opacity: key === role ? 1 : 0.8
                        }}
                      >
                        {label} {key === role && '✓'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="ds-nav">
          <Link to="/dashboard" className={`ds-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <DashIcon /> Dashboard
          </Link>
          <Link to="/research-hub" className={`ds-nav-item ${activeTab === 'research-hub' ? 'active' : ''}`}>
            <HubIcon /> Research Hub
          </Link>
          <Link to="/application-hub" className={`ds-nav-item ${activeTab === 'application-hub' ? 'active' : ''}`}>
            <AppIcon /> Application Hub
          </Link>
          <Link to="/admin/applications" className={`ds-nav-item ${activeTab === 'admin' ? 'active' : ''}`}>
            <AdminIcon /> Approve Applications
          </Link>
          <Link to="/" className="ds-nav-item">
            <GlobeIcon /> Main Website
          </Link>
        </nav>

        <div className="ds-sidebar-bottom">
          <button className="ds-logout-btn" onClick={handleLogout}>
            <LogoutIcon /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="ds-mobile-header">
        <button className="ds-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
        <Link to="/" className="ds-brand ds-brand-mobile">
          <img src="/assets/logo/Synthica Logo.png" alt="Synthica" className="ds-brand-logo" />
          <span>Synthica</span>
        </Link>
      </div>

      {/* Overlay for mobile */}
      {menuOpen && <div className="ds-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Main content */}
      <main className="ds-main">
        {children}
      </main>
    </div>
  );
}

// Icon components
const DashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const HubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
);
const AppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const AdminIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
