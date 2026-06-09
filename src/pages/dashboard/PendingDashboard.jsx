import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardShell from '../../components/dashboard/DashboardShell';
import { useUserAuth } from '../../hooks/useUserAuth';

export default function PendingDashboard({ firestoreError }) {
  const { user } = useUserAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'Researcher';

  const hasRulesError = firestoreError &&
    (firestoreError.includes('permission') ||
     firestoreError.includes('PERMISSION_DENIED') ||
     firestoreError.includes('insufficient'));

  return (
    <DashboardShell activeTab="dashboard">
      <div className="db-page">

        {/* Firestore rules error banner */}
        {hasRulesError && (
          <motion.div
            className="db-alert db-alert-warn"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <strong>⚠️ Firestore rules need updating.</strong> Your profile couldn't be saved to the database.
            Go to <strong>Firebase Console → Firestore → Security tab</strong> and replace the rules with the contents of <code>firestore.rules</code> in your project, then click <strong>Publish</strong>.
            After that, sign out and sign back in.
          </motion.div>
        )}

        <motion.div
          className="db-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="db-pending-hero">
            <div className="db-pending-icon">⏳</div>
            <h1 className="db-title">
              Welcome, <span className="yellow-text">{firstName}</span>!
            </h1>
            <p className="db-subtitle">
              Your account is pending role assignment. A Synthica admin will review your profile
              and assign you the appropriate role.
            </p>

            <div className="db-pending-steps">
              <div className="db-step">
                <div className="db-step-num done">✓</div>
                <div>
                  <strong>Google Sign-In</strong>
                  <p>Your account is active — signed in as {user?.email}</p>
                </div>
              </div>
              <div className="db-step">
                <div className="db-step-num active">2</div>
                <div>
                  <strong>Role Assignment</strong>
                  <p>An admin sets your role in the Firebase Console</p>
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
              <Link to="/research-hub"    className="db-btn-secondary">Browse Research Hub</Link>
            </div>
          </div>
        </motion.div>

        <div className="db-cards-grid db-cards-2">
          <motion.div className="db-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h3>📋 Application Hub</h3>
            <p>Apply to become a Chapter Leader, Lead Researcher, or Independent Researcher.</p>
            <Link to="/application-hub" className="db-card-link">Apply Now →</Link>
          </motion.div>
          <motion.div className="db-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h3>🔭 Research Hub</h3>
            <p>Explore ongoing projects and see what Synthica researchers are working on.</p>
            <Link to="/research-hub" className="db-card-link">Browse Projects →</Link>
          </motion.div>
        </div>

      </div>
    </DashboardShell>
  );
}
