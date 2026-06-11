import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import { supabase } from '../../lib/supabaseClient';

const ROLE_LABELS = {
  chapter_leader: 'Chapter Leader',
  lead_researcher: 'Lead Researcher',
  associate_researcher: 'Associate Researcher',
  independent_researcher: 'Independent Researcher',
};

const ROLE_COLORS = {
  chapter_leader: '#2589ed',
  lead_researcher: '#FFD700',
  associate_researcher: '#78b4fb',
  independent_researcher: '#69aaec',
};

// Admin emails - only these users can access the Application Manager
const ADMIN_EMAILS = ['friendlyfoe241@gmail.com'];

export default function DashboardShell({ children, activeTab }) {
  const { user, userProfile, logout, refreshProfile } = useUserAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [approvedRoles, setApprovedRoles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    institution: '',
    interests: '',
    linkedin: '',
    twitter: '',
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const roleSwitcherRef = useRef(null);
  const userMenuRef = useRef(null);

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target)) {
        setShowRoleSwitcher(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch approved roles from profile's roles array
  useEffect(() => {
    if (!user || !userProfile) return;

    // Use roles from profile if available, otherwise check applications
    const fetchApprovedRoles = async () => {
      try {
        // First check if profile has roles array
        if (userProfile?.roles && Array.isArray(userProfile.roles) && userProfile.roles.length > 0) {
          setApprovedRoles(userProfile.roles);
          return;
        }

        // Fallback: query approved applications
        const { data, error } = await supabase
          .from('applications')
          .select('role_applied')
          .eq('user_id', user.id)
          .eq('status', 'approved');

        if (!error && data) {
          const uniqueRoles = [...new Set(data.map(app => app.role_applied))];
          setApprovedRoles(uniqueRoles);
        } else if (userProfile?.role) {
          // Fallback to single role field
          setApprovedRoles([userProfile.role]);
        }
      } catch (err) {
        console.error('Error fetching approved roles:', err);
        // Fallback to single role field
        if (userProfile?.role) {
          setApprovedRoles([userProfile.role]);
        }
      }
    };

    fetchApprovedRoles();
  }, [user, userProfile]);

  // Fetch notifications for lead researchers
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data) {
          setNotifications(data || []);
          setUnreadCount(data?.length || 0);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleRoleSwitch = async (newRole) => {
    if (!user || switchingRole) return;
    setSwitchingRole(true);
    try {
      // Update the active role (keeps all roles in the array)
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      
      // Update local state to reflect the change
      setApprovedRoles(prev => {
        if (!prev.includes(newRole)) {
          return [...prev, newRole];
        }
        return prev;
      });
      
      setShowRoleSwitcher(false);
    } catch (err) {
      console.error('Error switching role:', err);
      alert('Failed to switch role');
    } finally {
      setSwitchingRole(false);
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      full_name: userProfile?.full_name || '',
      bio: userProfile?.bio || '',
      institution: userProfile?.institution || '',
      interests: userProfile?.interests || '',
      linkedin: userProfile?.linkedin || '',
      twitter: userProfile?.twitter || '',
    });
    setShowUserMenu(false);
    setEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to update profile: ' + err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
  };

  // Get current role from approved roles or profile
  const currentRole = userProfile?.role || (approvedRoles.length > 0 ? approvedRoles[0] : null);
  const roleLabel = currentRole ? ROLE_LABELS[currentRole] : 'No Role';
  const roleColor = currentRole ? ROLE_COLORS[currentRole] : '#6B7280';

  return (
    <div className="ds-layout">
      {/* Sidebar */}
      <aside className={`ds-sidebar ${menuOpen ? 'ds-sidebar-open' : ''}`}>
        <div className="ds-sidebar-top">
          <Link to="/" className="ds-brand">
            <img src="/assets/logo/Synthica Logo.png" alt="Synthica" className="ds-brand-logo" />
            <span>Synthica</span>
          </Link>

          {/* User Menu */}
          <div className="ds-user-card" ref={userMenuRef} style={{ position: 'relative' }}>
            <div 
              className="ds-user-clickable"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}
            >
              <img
                src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/assets/logo/Synthica Preview Image (5).jpg'}
                alt={user?.user_metadata?.full_name || user?.email}
                className="ds-avatar"
              />
              <div className="ds-user-info">
                <p className="ds-user-name">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Researcher'}</p>
                {approvedRoles.length > 0 && (
                  <span 
                    className="ds-role-badge"
                    style={{ 
                      background: `${roleColor}22`, 
                      color: roleColor, 
                      border: `1px solid ${roleColor}44`
                    }}
                  >
                    {roleLabel}
                  </span>
                )}
                {approvedRoles.length === 0 && (
                  <span className="ds-role-badge" style={{ background: '#f1f5f9', color: '#6B7280', border: '1px solid #e2e8f0' }}>
                    No Role
                  </span>
                )}
              </div>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{ marginLeft: 'auto', color: '#94a3b8', transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="ds-user-dropdown">
                <button 
                  className="ds-dropdown-item"
                  onClick={handleEditProfile}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Profile
                </button>
                {approvedRoles.length > 1 && (
                  <button 
                    className="ds-dropdown-item"
                    onClick={() => { setShowUserMenu(false); setShowRoleSwitcher(true); }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <polyline points="17 11 19 13 23 9"/>
                    </svg>
                    Switch Role
                  </button>
                )}
                <div className="ds-dropdown-divider" />
                <button className="ds-dropdown-item ds-dropdown-danger" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Role Switcher Dropdown */}
          {approvedRoles.length > 1 && (
            <div ref={roleSwitcherRef} style={{ position: 'relative', marginTop: '0.75rem', width: '100%' }}>
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="ds-role-switcher-btn"
                style={{ 
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'white',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  fontFamily: "'Garet', sans-serif",
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <polyline points="17 11 19 13 23 9"/>
                  </svg>
                  Switch Role
                </span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ transform: showRoleSwitcher ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: '#94a3b8' }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {showRoleSwitcher && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  {approvedRoles.map((roleKey) => (
                    <button
                      key={roleKey}
                      onClick={() => handleRoleSwitch(roleKey)}
                      disabled={switchingRole || roleKey === currentRole}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.875rem 1rem',
                        textAlign: 'left',
                        background: roleKey === currentRole ? `${ROLE_COLORS[roleKey]}15` : 'transparent',
                        color: ROLE_COLORS[roleKey],
                        border: 'none',
                        cursor: roleKey === currentRole ? 'default' : 'pointer',
                        fontWeight: '700',
                        fontSize: '0.875rem',
                        fontFamily: "'Garet', sans-serif",
                        transition: 'background 0.15s'
                      }}
                    >
                      <span>{ROLE_LABELS[roleKey]}</span>
                      {roleKey === currentRole && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="ds-nav">
          <Link to="/dashboard" className={`ds-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <DashIcon /> Dashboard
            {unreadCount > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: '#EF4444',
                color: 'white',
                borderRadius: '10px',
                padding: '0.15rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: '700',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </Link>
          <Link to="/research-hub" className={`ds-nav-item ${activeTab === 'research-hub' ? 'active' : ''}`}>
            <HubIcon /> Research Hub
          </Link>
          <Link to="/application-hub" className={`ds-nav-item ${activeTab === 'application-hub' ? 'active' : ''}`}>
            <AppIcon /> Application Hub
          </Link>
          <Link to="/people" className={`ds-nav-item ${activeTab === 'people' ? 'active' : ''}`}>
            <PeopleIcon /> People
          </Link>
          {isAdmin && (
            <Link to="/admin/applications" className={`ds-nav-item ${activeTab === 'admin' ? 'active' : ''}`}>
              <AdminIcon /> Approve Applications
            </Link>
          )}
          <Link to="/" className="ds-nav-item">
            <GlobeIcon /> Main Website
          </Link>
        </nav>
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

      {/* Profile Edit Modal */}
      {editingProfile && (
        <div className="profile-modal-overlay" onClick={handleCancelEdit}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>Edit Profile</h2>
              <button className="profile-modal-close" onClick={handleCancelEdit}>×</button>
            </div>
            <div className="profile-modal-form">
              <div className="profile-form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Your display name"
                />
              </div>
              <div className="profile-form-group">
                <label>Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell others about yourself..."
                  rows={3}
                />
              </div>
              <div className="profile-form-group">
                <label>Institution / School</label>
                <input
                  type="text"
                  value={editForm.institution}
                  onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                  placeholder="Your school or organization"
                />
              </div>
              <div className="profile-form-group">
                <label>Research Interests</label>
                <input
                  type="text"
                  value={editForm.interests}
                  onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                  placeholder="e.g., Machine Learning, Climate Science"
                />
              </div>
              <div className="profile-form-group">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  value={editForm.linkedin}
                  onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="profile-form-group">
                <label>Twitter / X URL</label>
                <input
                  type="url"
                  value={editForm.twitter}
                  onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="profile-modal-actions">
                <button className="profile-edit-cancel" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button className="profile-edit-save" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
const PeopleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
