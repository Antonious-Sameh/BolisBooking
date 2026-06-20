import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import TeacherLoginPage from './pages/TeacherLoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Hidden routes for admin access */}
        <Route path="/teacher-login" element={<TeacherLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Catch all route */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Toaster position="top-center" rtl={true} />
    </Router>
  );
}

export default App;