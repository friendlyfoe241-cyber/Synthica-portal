import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardShell from '../components/dashboard/DashboardShell';
import { supabase } from '../lib/supabaseClient';
import { useUserAuth } from '../hooks/useUserAuth';

const ROLE_LABELS = {
  chapter_leader: 'Chapter Leader',
  lead_researcher: 'Lead Researcher',
  associate_researcher: 'Associate Researcher',
  independent_researcher: 'Independent Researcher',
};

export default function People() {
  const { user } = useUserAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    institution: '',
    interests: '',
    linkedin: '',
    twitter: '',
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProfiles(data);
    }
    setLoading(false);
  };

  const handleEditProfile = () => {
    if (selectedProfile && selectedProfile.id === user.id) {
      setEditForm({
        full_name: selectedProfile.full_name || '',
        bio: selectedProfile.bio || '',
        institution: selectedProfile.institution || '',
        interests: selectedProfile.interests || '',
        linkedin: selectedProfile.linkedin || '',
        twitter: selectedProfile.twitter || '',
      });
      setEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setProfiles(prev => prev.map(p => 
        p.id === user.id ? { ...p, ...editForm } : p
      ));
      setSelectedProfile(prev => prev ? { ...prev, ...editForm } : null);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to update profile: ' + err.message);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const query = searchQuery.toLowerCase();
    return (
      profile.full_name?.toLowerCase().includes(query) ||
      profile.bio?.toLowerCase().includes(query) ||
      profile.institution?.toLowerCase().includes(query) ||
      profile.interests?.toLowerCase().includes(query) ||
      profile.role?.toLowerCase().includes(query)
    );
  });

  const content = (
    <div className="people-page">
      <div className="people-header">
        <h1>People</h1>
        <p>Connect with other researchers and view their profiles</p>
      </div>

      <div className="people-content">
        <div className="people-list-section">
          <div className="people-search">
            <input
              type="text"
              placeholder="Search by name, institution, interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="people-search-input"
            />
          </div>

          <div className="people-list">
            {loading ? (
              <div className="people-loading">
                <div className="dashboard-spinner" />
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="people-empty">
                <p>No people found matching your search.</p>
              </div>
            ) : (
              filteredProfiles.map(profile => (
                <div
                  key={profile.id}
                  className={`people-card ${selectedProfile?.id === profile.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedProfile(profile);
                    setEditing(false);
                  }}
                >
                  <img
                    src={profile.avatar_url || '/assets/logo/Synthica Preview Image (5).jpg'}
                    alt={profile.full_name || 'User'}
                    className="people-card-avatar"
                  />
                  <div className="people-card-info">
                    <h3>{profile.full_name || 'Anonymous'}</h3>
                    <span className="people-card-role">
                      {ROLE_LABELS[profile.role] || 'Member'}
                    </span>
                    {profile.institution && (
                      <p className="people-card-institution">{profile.institution}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="people-profile-section">
          {selectedProfile ? (
            editing ? (
              <div className="profile-edit">
                <div className="profile-edit-header">
                  <h2>Edit Your Profile</h2>
                  <button className="profile-edit-close" onClick={() => setEditing(false)}>×</button>
                </div>
                <div className="profile-edit-form">
                  <div className="profile-form-group">
                    <label>Display Name</label>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="profile-form-group">
                    <label>Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell others about yourself..."
                      rows={4}
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
                  <div className="profile-edit-actions">
                    <button className="profile-edit-cancel" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                    <button className="profile-edit-save" onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-view">
                <div className="profile-header">
                  <img
                    src={selectedProfile.avatar_url || '/assets/logo/Synthica Preview Image (5).jpg'}
                    alt={selectedProfile.full_name || 'User'}
                    className="profile-avatar"
                  />
                  <div className="profile-header-info">
                    <h2>{selectedProfile.full_name || 'Anonymous'}</h2>
                    <span className="profile-role">
                      {ROLE_LABELS[selectedProfile.role] || 'Member'}
                    </span>
                    {selectedProfile.institution && (
                      <p className="profile-institution">{selectedProfile.institution}</p>
                    )}
                  </div>
                  {selectedProfile.id === user.id && (
                    <button className="profile-edit-btn" onClick={handleEditProfile}>
                      Edit Profile
                    </button>
                  )}
                </div>

                {selectedProfile.bio && (
                  <div className="profile-section">
                    <h3>About</h3>
                    <p>{selectedProfile.bio}</p>
                  </div>
                )}

                {selectedProfile.interests && (
                  <div className="profile-section">
                    <h3>Research Interests</h3>
                    <div className="profile-interests">
                      {selectedProfile.interests.split(',').map((interest, i) => (
                        <span key={i} className="profile-interest-tag">
                          {interest.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="profile-section">
                  <h3>Connect</h3>
                  <div className="profile-links">
                    {selectedProfile.linkedin && (
                      <a href={selectedProfile.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link linkedin">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {selectedProfile.twitter && (
                      <a href={selectedProfile.twitter} target="_blank" rel="noopener noreferrer" className="profile-link twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter / X
                      </a>
                    )}
                    {!selectedProfile.linkedin && !selectedProfile.twitter && selectedProfile.id === user.id && (
                      <p className="profile-no-links">Add your social links by editing your profile.</p>
                    )}
                    {(!selectedProfile.linkedin && !selectedProfile.twitter) && selectedProfile.id !== user.id && (
                      <p className="profile-no-links">No social links added.</p>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="profile-empty">
              <div className="profile-empty-icon">👥</div>
              <h3>Select a person to view their profile</h3>
              <p>Click on any card from the list to view their portfolio and connect with them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return <DashboardShell activeTab="people">{content}</DashboardShell>;
}