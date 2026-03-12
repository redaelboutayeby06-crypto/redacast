import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import Landing from './pages/Landing';
import Login   from './pages/Login';
import AppPage from './pages/App';
import Privacy from './pages/Privacy';
import Terms   from './pages/Terms';
import './index.css';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 40 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="wave-bar" style={{ height: '100%', animation: `wave 1.4s ease-in-out infinite`, animationDelay: `${i * 0.07}s` }} />
        ))}
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

export default function Root() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"        element={<Landing />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/app"     element={<AppPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms"   element={<Terms />} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}