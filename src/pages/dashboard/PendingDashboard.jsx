import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardShell from '../../components/dashboard/DashboardShell';
import { useUserAuth } from '../../hooks/useUserAuth';

export default function PendingDashboard() {
  const { user } = useUserAuth();

  return (
    <DashboardShell activeTab="dashboard">
      <div className="db-page">
        <motion.div
          className="db-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="db-hero-inner db-pending-hero">
            <div className="db-pending-icon">⏳</div>
            <h1 className="db-title">Welcome, <span className="yellow-text">{user?.displayName?.split(' ')[0] || 'Researcher'}</span>!</h1>
            <p className="db-subtitle">Your account is pending role assignment. A Synthica admin will review your profile and assign you the appropriate role soon.</p>

            <div className="db-pending-steps">
              <div className="db-step">
                <div className="db-step-num done">✓</div>
                <div>
                  <strong>Google Sign-In</strong>
                  <p>Your account is active</p>
                </div>
              </div>
              <div className="db-step">
                <div className="db-step-num active">2</div>
                <div>
                  <strong>Role Assignment</strong>
                  <p>Admins are reviewing your profile</p>
                </div>
              </div>
              <div className="db-step">
                <div className="db-step-num">3</div>
                <div>
                  <strong>Dashboard Access</strong>
                  <p>Full access to your role-specific tools</p>
                </div>
              </div>
            </div>

            <div className="db-pending-actions">
              <Link to="/application-hub" className="db-btn-primary">Apply for a Role</Link>
              <Link to="/research-hub" className="db-btn-secondary">Browse Research Hub</Link>
            </div>
          </div>
        </motion.div>

        <div className="db-cards-grid db-cards-2">
          <motion.div className="db-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h3>📋 Application Hub</h3>
            <p>Apply to become a Chapter Leader, Lead Researcher, or Independent Researcher.</p>
            <Link to="/application-hub" className="db-card-link">Apply Now →</Link>
          </motion.div>
          <motion.div className="db-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h3>🔭 Research Hub</h3>
            <p>Explore ongoing projects and see what Synthica researchers are working on.</p>
            <Link to="/research-hub" className="db-card-link">Browse Projects →</Link>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}
