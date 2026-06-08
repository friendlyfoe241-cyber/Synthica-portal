import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, userProfile, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
