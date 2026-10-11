import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DailyPage from './pages/DailyPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import Toast from './components/Toast';
import { api } from './utils/api';

const SETTINGS_KEY = 'skillbite_settings';

function getSettings() {
  try {
    return { sound: true, reminder: true, reducedMotion: false, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return { sound: true, reminder: true, reducedMotion: false };
  }
}

function getSavedUser() {
  try { return JSON.parse(localStorage.getItem('skillbite_user') || 'null') } catch { return null }
}

function pageToPath(page) {
  if (page === 'daily') return '/daily';
  if (page === 'leaderboard') return '/leaderboard';
  if (page === 'profile') return '/profile';
  if (page === 'analytics') return '/analytics';
  return '/';
}

function pathToPage(pathname) {
  if (pathname.startsWith('/daily')) return 'daily';
  if (pathname.startsWith('/leaderboard')) return 'leaderboard';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname.startsWith('/analytics')) return 'analytics';
  return 'dashboard';
}

export default function App() {
  const [user, setUser] = useState(getSavedUser);
  const [page, setPage] = useState(() => pathToPage(window.location.pathname));
  const [records, setRecords] = useState([]);
  const [settings, _setSettings] = useState(getSettings);

  const navigatePage = useCallback((nextPage) => {
    const targetPath = pageToPath(nextPage);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setPage(nextPage);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('reduce-motion', !!settings.reducedMotion);
  }, [settings.reducedMotion]);

  useEffect(() => {
    const onPopState = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [user]);

  useEffect(() => {
    if (!user) { setRecords([]); return; }
    api.getAnswers().then(data => setRecords(Array.isArray(data) ? data : [])).catch(() => setRecords([]));
  }, [user]);

  const handleAuth = useCallback((userData) => {
    localStorage.setItem('skillbite_user', JSON.stringify(userData));
    setUser(userData);
    navigatePage('dashboard');
  }, [navigatePage]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('skillbite_token');
    localStorage.removeItem('skillbite_user');
    setUser(null);
    setRecords([]);
    navigatePage('dashboard');
  }, [navigatePage]);

  const handleSaveAnswer = useCallback(async (data) => {
    try {
      const saved = await api.saveAnswer({
        ...data,
        completedAt: new Date().toISOString(),
      });
      setRecords(prev => [...prev, { ...saved, id: saved.id || Date.now() }]);
    } catch { /* silent */ }
  }, []);

  return (
    <>
      <Toast />
      <div className="animated-bg" />
      <div className="hero-overlay" />
      
      {!user ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
           {/* We will let AuthPage handle the styling context seamlessly in the dark theme */}
          <AuthPage onAuth={handleAuth} />
        </div>
      ) : (
        <Layout activePage={page} onNavigate={navigatePage} user={user} onLogout={handleLogout}>
          {page === 'dashboard'   && <DashboardPage records={records} user={user} onNavigate={navigatePage} />}
          {page === 'analytics'   && <AnalyticsPage records={records} user={user} />}
          {page === 'daily'       && <DailyPage onSaveAnswer={handleSaveAnswer} />}
          {page === 'leaderboard' && <LeaderboardPage records={records} user={user} />}
          {page === 'profile'     && <ProfilePage records={records} user={user} onLogout={handleLogout} />}

        </Layout>
      )}
    </>
  );
}
