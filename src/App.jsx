import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useUserAuth";
import Home from "./pages/Home";
import About from "./pages/About";
import WorkWithUs from "./pages/WorkWithUs";
import Newsletter from "./pages/Newsletter";
import Article from "./pages/Article";
import Admin from "./pages/Admin";
import EditorialBoard from "./pages/EditorialBoard";
import Journal from "./pages/Journal";
import ResearchGroup from "./pages/ResearchGroup";
import SisterProgram from "./pages/SisterProgram";
import FreeCourse from "./pages/FreeCourse";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import ResearchHub from "./pages/ResearchHub";
import ApplicationHub from "./pages/ApplicationHub";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/newsletter/:slug" element={<Article />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/work-with-us" element={<WorkWithUs />} />
        <Route path="/editorial-board" element={<EditorialBoard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/research-group" element={<ResearchGroup />} />
        <Route path="/sister-program" element={<SisterProgram />} />
        <Route path="/free-course" element={<FreeCourse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/research-hub" element={<ResearchHub />} />
        <Route path="/application-hub" element={<ApplicationHub />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
