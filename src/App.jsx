import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberDetails from './pages/MemberDetails';
import Plans from './pages/Plans';
import Announcements from './pages/Announcements';
import ChangePassword from './pages/ChangePassword';
import Layout from './components/Layout';
import DietPlans from './pages/DietPlans';
import CreateDietPlan from './pages/CreateDietPlan';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/members" element={
            <ProtectedRoute>
              <Layout>
                <Members />
              </Layout>
            </ProtectedRoute>
          } />

            <Route path="/diet-plans" element={
              <ProtectedRoute>
                <Layout>
                  <DietPlans />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/create-diet-plan" element={
              <ProtectedRoute>
                <Layout>
                  <CreateDietPlan />
                </Layout>
              </ProtectedRoute>
            } />

          <Route path="/members/:id" element={
            <ProtectedRoute>
              <Layout>
                <MemberDetails />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/plans" element={
            <ProtectedRoute>
              <Layout>
                <Plans />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/announcements" element={
            <ProtectedRoute>
              <Layout>
                <Announcements />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/change-password" element={
            <ProtectedRoute>
              <Layout>
                <ChangePassword />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch all route - redirect to dashboard if authenticated, login if not */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
