import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import ChapterLeaderDashboard from './ChapterLeaderDashboard';
import LeadResearcherDashboard from './LeadResearcherDashboard';
import AssociateResearcherDashboard from './AssociateResearcherDashboard';
import IndependentResearcherDashboard from './IndependentResearcherDashboard';
import PendingDashboard from './PendingDashboard';

export default function DashboardRouter() {
  const { userProfile, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  if (!userProfile) return <Navigate to="/login" replace />;

  switch (userProfile.role) {
    case 'chapter_leader':    return <ChapterLeaderDashboard />;
    case 'lead_researcher':   return <LeadResearcherDashboard />;
    case 'associate_researcher': return <AssociateResearcherDashboard />;
    case 'independent_researcher': return <IndependentResearcherDashboard />;
    default:                  return <PendingDashboard />;
  }
}
