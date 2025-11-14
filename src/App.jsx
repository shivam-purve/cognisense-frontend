import { cloneElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import { useAuth } from './AuthContext';

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-300 text-sm">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return cloneElement(children, { user });
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f1419]">
        <Navbar />
        <main className="max-w-[1400px] mx-auto px-8 py-8">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={(
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              )}
            />
            <Route
              path="/analytics"
              element={(
                <RequireAuth>
                  <Analytics />
                </RequireAuth>
              )}
            />
            <Route
              path="/insights"
              element={(
                <RequireAuth>
                  <Insights />
                </RequireAuth>
              )}
            />
            <Route
              path="/settings"
              element={(
                <RequireAuth>
                  <Settings />
                </RequireAuth>
              )}
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
