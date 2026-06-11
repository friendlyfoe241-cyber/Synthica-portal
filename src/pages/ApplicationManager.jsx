import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUserAuth } from '../hooks/useUserAuth';

const ROLES = {
  'chapter_leader': 'Chapter Leader',
  'lead_researcher': 'Lead Researcher',
  'associate_researcher': 'Associate Researcher',
  'independent_researcher': 'Independent Researcher',
};

// Admin emails - only these users can access the Application Manager
const ADMIN_EMAILS = ['friendlyfoe241@gmail.com'];

export default function ApplicationManager() {
  const { user } = useUserAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const updateApplication = async (id, newStatus) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchApplications();
    } catch (err) {
      console.error('Error updating application:', err);
      alert('Failed to update application: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const approveApplication = async (app) => {
    if (!window.confirm(`Approve this application for ${ROLES[app.role_applied]}?`)) return;

    setUpdating(app.id);
    try {
      // Update application status in database
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', app.id);

      if (appError) {
        console.error('Application update error:', appError);
        throw appError;
      }

      // Add role to user's profile (as array element)
      // First, get the current roles
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('roles, role')
        .eq('id', app.user_id)
        .single();

      if (fetchError) {
        console.error('Fetch profile error:', fetchError);
        throw fetchError;
      }

      // Get current roles array or create new one
      let currentRoles = currentProfile?.roles || [];
      if (!Array.isArray(currentRoles)) {
        currentRoles = currentProfile?.role ? [currentProfile.role] : [];
      }

      // Add the new role if not already present
      if (!currentRoles.includes(app.role_applied)) {
        const newRoles = [...currentRoles, app.role_applied];
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            roles: newRoles,
            role: app.role_applied, // Keep backwards compatible single role
            updated_at: new Date().toISOString()
          })
          .eq('id', app.user_id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }
      }

      // Remove this application from the local state
      setApplications(prev => prev.filter(a => a.id !== app.id));
      alert('Application approved! User has been assigned the role.');
    } catch (err) {
      console.error('Error approving application:', err);
      alert('Failed to approve application: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdating(null);
    }
  };

  const rejectApplication = async (app) => {
    if (!window.confirm('Reject this application?')) return;
    setUpdating(app.id);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', app.id);

      if (error) {
        console.error('Reject error:', error);
        throw error;
      }

      // Remove this application from the local state
      setApplications(prev => prev.filter(a => a.id !== app.id));
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert('Failed to reject application: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Only show processed apps if they exist in current session
  const [processedCount, setProcessedCount] = useState(0);

  if (!user) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Please sign in to view applications</h2>
      </div>
    );
  }

  // Check if user is an admin
  const isAdmin = ADMIN_EMAILS.includes(user.email);

  if (!isAdmin) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ color: '#6B7280' }}>You do not have permission to view this page.</p>
      </div>
    );
  }

  const pendingApps = applications.filter(a => a.status === 'pending');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>
        Application Manager
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="dashboard-spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <>
          {/* Pending Applications */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#FFD700' }}>
              Pending Applications ({pendingApps.length})
            </h2>

            {pendingApps.length === 0 ? (
              <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#6B7280' }}>
                No pending applications
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingApps.map(app => (
                  <div key={app.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{app.user_name}</h3>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{app.user_email}</p>
                      </div>
                      <span style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {ROLES[app.role_applied] || app.role_applied}
                      </span>
                    </div>

                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.6' }}>
                        {app.statement}
                      </p>
                    </div>

                    {app.project_title && (
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
                        Project: <strong>{app.project_title}</strong>
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                        Applied: {formatDate(app.created_at)}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => rejectApplication(app)}
                          disabled={updating === app.id}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#EF4444',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => approveApplication(app)}
                          disabled={updating === app.id}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          {updating === app.id ? 'Processing...' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}