import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import EditorPage from "./pages/EditorPage"; 
import AdminDashboardPage from "./pages/AdminDashboardPage"; 
import FeedbackPage from "./pages/FeedbackPage"; 
import PrivateRoute from "../PrivateRoute";
import SettingsPage from "./pages/SettingsPage";
import DocumentPage from "./pages/DocumentPage";
import AdminDraftView from "./pages/AdminDraftView";
import AdminSettings from "./pages/AdminSettings";
import Feedback from "./pages/Feedback";
import DraftViewEditPage from "./pages/DraftViewEditPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected Routes for Users */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/editor" 
        element={
          <PrivateRoute>
            <EditorPage />
          </PrivateRoute>
        } 
      />

      {/* Protected Route for Admin */}
      <Route 
        path="/admin-dashboard" 
        element={
          <PrivateRoute>
            <AdminDashboardPage />
          </PrivateRoute>
        } 
      />

    <Route 
    path="/admin-documents" 
    element={
    <PrivateRoute>
      <AdminDraftView />
    </PrivateRoute>
    }
    />

  <Route 
    path="/admin-feedback" 
    element={
    <PrivateRoute>
      <Feedback />
    </PrivateRoute>
    }
    />

<Route 
    path="/admin-settings" 
    element={
    <PrivateRoute>
      <AdminSettings />
    </PrivateRoute>
    }
    />

      {/* Feedback Page Route */}
      <Route 
        path="/feedback" 
        element={
          <PrivateRoute>
            <FeedbackPage />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/settings" 
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/documents" 
        element={
          <PrivateRoute>
            <DocumentPage />
          </PrivateRoute>
        } 
      />

    <Route 
        path="/viewedit/:draftId" 
        element={
          <PrivateRoute>
            <DraftViewEditPage />
          </PrivateRoute>
        } 
      />


    </Routes>
  );
}

export default App;
