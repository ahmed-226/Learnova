import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import CourseDetailsPage from './pages/CourseDetailsPage.jsx';
import CourseContentPage from './pages/CourseContentPage.jsx';
import ForumPage from './pages/ForumPage.jsx';
import ThreadPage from './pages/ThreadPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import CreateCoursePage from './pages/CreateCoursePage.jsx';
import CourseModuleManagementPage from './pages/CourseModuleManagementPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* PUBLIC ROUTES - Anyone can access */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailsPage />} />

            {/* PROTECTED ROUTES - Only logged-in users */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path="/courses/:courseId/content" element={
              <ProtectedRoute>
                <CourseContentPage />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/:contentType/:contentId" element={
              <ProtectedRoute>
                <CourseContentPage />
              </ProtectedRoute>
            } />
            
            <Route path="/courses/:courseId/forum" element={
              <ProtectedRoute>
                <ForumPage />
              </ProtectedRoute>
            } />
            
            <Route path="/courses/:courseId/forum/thread/:threadId" element={
              <ProtectedRoute>
                <ThreadPage />
              </ProtectedRoute>
            } />

            {/* INSTRUCTOR-ONLY ROUTES - Only instructors can access */}
            <Route path="/create-course" element={
              <ProtectedRoute requiredRole="INSTRUCTOR">
                <CreateCoursePage />
              </ProtectedRoute>
            } />
            
            <Route path="/courses/:courseId/modules" element={
              <ProtectedRoute requiredRole="INSTRUCTOR">
                <CourseModuleManagementPage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;