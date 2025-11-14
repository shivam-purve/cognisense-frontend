import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Moon, Sun, Bell, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/insights', label: 'Insights' },
    { path: '/settings', label: 'Settings' },
  ];

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  useEffect(() => {
    if (!showSignOutModal) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowSignOutModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSignOutModal]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('light', !newTheme);
    
    // Update body background color
    if (newTheme) {
      document.body.style.backgroundColor = '#0f1419';
    } else {
      document.body.style.backgroundColor = '#f3f4f6';
    }
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split('@')[0] : '');

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  useEffect(() => {
    // Reset avatar error state when the avatar URL changes
    setAvatarError(false);
  }, [avatarUrl]);

  const handleOpenSignOutModal = () => {
    setShowSignOutModal(true);
  };

  const handleCloseSignOutModal = () => {
    setShowSignOutModal(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowSignOutModal(false);
    navigate('/auth');
  };

  // Hide navbar on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <nav className={`bg-[${isDarkMode ? '#1a1f2e' : '#f9fafb'}] border-b border-gray-800`}>
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-semibold text-white">Digital Footprint</span>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  location.pathname === item.path
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <select className="bg-[#2d3748] text-gray-300 p-5 text-sm rounded px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={handleOpenSignOutModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                {avatarUrl && !avatarError ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || 'User avatar'}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : displayName ? (
                  <span className="text-xs font-semibold">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
      {showSignOutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={handleCloseSignOutModal}
        >
          <div
            className="bg-[#111827] border border-gray-700 rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-100 mb-2">Sign out</h2>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to sign out of Digital Footprint?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseSignOutModal}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;