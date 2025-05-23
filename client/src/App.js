
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="/courses/:courseId/:contentType/:contentId" element={<CourseContentPage />} />
          
          <Route path="/courses/:courseId/forum" element={<ForumPage />} />
          <Route path="/courses/:courseId/forum/thread/:threadId" element={<ThreadPage />} />
          
          <Route path="/create-course" element={<CreateCoursePage />} />
          <Route path="/courses/:courseId/modules" element={<CourseModuleManagementPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;