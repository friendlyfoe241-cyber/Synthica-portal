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
  const { user, refreshProfile } = useUserAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch ALL applications from the database - no filtering by user
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        setError('Failed to fetch applications: ' + error.message);
        setApplications([]);
      } else {
        console.log('Fetched applications:', data?.length || 0);
        setApplications(data || []);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Error: ' + err.message);
      setApplications([]);
    }
    setLoading(false);
  };

  const approveApplication = async (app) => {
    if (!window.confirm(`Approve this application for ${ROLES[app.role_applied]}?`)) return;

    setUpdating(app.id);
    setError(null);
    
    try {
      // 1. Update application status to 'approved'
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', app.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        setError('Failed to update: ' + error.message);
        alert('Failed to approve application. Error: ' + error.message);
        return;
      }

      // 2. Update profiles table to add the role to user's roles array
      const roleKey = app.role_applied;
      
      // First get the current profile to see existing roles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', app.user_id)
        .single();
      
      const currentRoles = profileData?.roles || [];
      
      // Add the new role if not already present
      if (!currentRoles.includes(roleKey)) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            roles: [...currentRoles, roleKey],
            status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('id', app.user_id);
        
        if (profileError) {
          console.error('Failed to update profile roles:', profileError);
        } else {
          // Refresh the user's profile so they get the new role immediately
          await refreshProfile();
        }
      }

      console.log('Application approved in DB:', data);
      // Update local state to reflect the change
      setApplications(prev => prev.map(a => 
        a.id === app.id ? { ...a, status: 'approved' } : a
      ));
      alert('Application approved! Status changed to approved.');
    } catch (err) {
      console.error('Error approving application:', err);
      setError('Error: ' + err.message);
      alert('Failed to approve application: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const rejectApplication = async (app) => {
    if (!window.confirm('Reject this application?')) return;

    setUpdating(app.id);
    setError(null);
    
    try {
      // Hard-coded: Update status to 'rejected' directly in the database
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', app.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        setError('Failed to update: ' + error.message);
        alert('Failed to reject application. Error: ' + error.message);
      } else {
        console.log('Application rejected in DB:', data);
        // Update local state to reflect the change
        setApplications(prev => prev.map(a => 
          a.id === app.id ? { ...a, status: 'rejected' } : a
        ));
      }
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError('Error: ' + err.message);
      alert('Failed to reject application: ' + err.message);
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

  // Filter applications by tab
  const getFilteredApps = () => {
    switch (activeTab) {
      case 'pending':
        return applications.filter(a => a.status === 'pending');
      case 'approved':
        return applications.filter(a => a.status === 'approved');
      case 'rejected':
        return applications.filter(a => a.status === 'rejected');
      case 'all':
      default:
        return applications;
    }
  };

  const filteredApps = getFilteredApps();

  const renderApplicationCard = (app) => (
    <div key={app.id} style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{app.user_name || 'Unknown User'}</h3>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{app.user_email}</p>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>ID: {app.id}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            background: app.status === 'approved' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : '#fef3c7',
            color: app.status === 'approved' ? '#16a34a' : app.status === 'rejected' ? '#ef4444' : '#92400e',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.5rem'
          }}>
            {app.status}
          </span>
          <br />
          <span style={{
            background: '#f1f5f9',
            color: '#64748b',
            padding: '0.2rem 0.5rem',
            borderRadius: '8px',
            fontSize: '0.7rem',
            fontWeight: '600'
          }}>
            {ROLES[app.role_applied] || app.role_applied}
          </span>
        </div>
      </div>

      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.6' }}>
          {app.statement || 'No statement provided'}
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
        {app.status === 'pending' && (
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
        )}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>
        Application Manager
      </h1>

      {error && (
        <div style={{ 
          padding: '1rem', 
          background: '#fee2e2', 
          border: '1px solid #ef4444', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          color: '#ef4444'
        }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        {[
          { key: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
          { key: 'approved', label: 'Approved', count: applications.filter(a => a.status === 'approved').length },
          { key: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
          { key: 'all', label: 'All', count: applications.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.key ? '#2589ed' : '#f1f5f9',
              color: activeTab === tab.key ? 'white' : '#64748b',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="dashboard-spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <>
          {filteredApps.length === 0 ? (
            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#6B7280' }}>
              No {activeTab === 'all' ? '' : activeTab} applications
            </div>
          ) : (
            <div>
              {filteredApps.map(renderApplicationCard)}
            </div>
          )}
        </>
      )}
    </div>
  );
}