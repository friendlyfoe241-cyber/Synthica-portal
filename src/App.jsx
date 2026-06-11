import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useUserAuth";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import ResearchHub from "./pages/ResearchHub";
import ApplicationHub from "./pages/ApplicationHub";
import ApplicationManager from "./pages/ApplicationManager";
import People from "./pages/People";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/research-hub"
          element={
            <ProtectedRoute>
              <ResearchHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/application-hub"
          element={
            <ProtectedRoute>
              <ApplicationHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/people"
          element={
            <ProtectedRoute>
              <People />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute>
              <ApplicationManager />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
