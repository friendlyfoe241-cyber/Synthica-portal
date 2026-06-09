import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import ChapterLeaderDashboard       from './ChapterLeaderDashboard';
import LeadResearcherDashboard      from './LeadResearcherDashboard';
import AssociateResearcherDashboard from './AssociateResearcherDashboard';
import IndependentResearcherDashboard from './IndependentResearcherDashboard';
import PendingDashboard             from './PendingDashboard';

export default function DashboardRouter() {
  const { user, userProfile, loading, profileError } = useUserAuth();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner" />
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  // Not signed in at all → send to login
  if (!user) return <Navigate to="/login" replace />;

  // Signed in but profile couldn't load (Firestore rules issue) → show pending
  // with a helpful notice instead of looping back to login
  if (!userProfile) {
    return <PendingDashboard firestoreError={profileError} />;
  }

  switch (userProfile.role) {
    case 'chapter_leader':         return <ChapterLeaderDashboard />;
    case 'lead_researcher':        return <LeadResearcherDashboard />;
    case 'associate_researcher':   return <AssociateResearcherDashboard />;
    case 'independent_researcher': return <IndependentResearcherDashboard />;
    default:                       return <PendingDashboard />;
  }
}
