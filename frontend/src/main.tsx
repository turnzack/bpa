// Kirov5 Sovereign Forge - SaaS Cloud & Local Dev
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import AuthScreen from './components/AuthScreen.tsx'
import './index.css'
import './design.css'

interface AuthUser {
  userId: string;
  email: string;
  isSuperAdmin?: boolean;
}

function Root() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  // Vérifier la session existante au démarrage
  useEffect(() => {
    const check = async () => {
      try {
        const token = localStorage.getItem('kirov5_jwt_token');
        if (!token) {
          setUser(null);
          setChecking(false);
          return;
        }

        const res = await fetch('/api/auth/session', { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser({ 
              userId: String(data.userId || 'user'), 
              email: data.email || 'user@cloud',
              isSuperAdmin: Boolean(data.isSuperAdmin)
            });
          } else {
            localStorage.removeItem('kirov5_jwt_token');
            setUser(null);
          }
        } else {
          localStorage.removeItem('kirov5_jwt_token');
          setUser(null);
        }
      } catch {
        // En cas d'erreur réseau
        const token = localStorage.getItem('kirov5_jwt_token');
        if (token && token.startsWith('dev-')) {
          setUser({ userId: 'dev-user-001', email: 'dev@kirov5.local', isSuperAdmin: true });
        } else {
          setUser(null);
        }
      } finally {
        setChecking(false);
      }
    };
    check();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kirov5_jwt_token');
    localStorage.removeItem('tiger_currentUserEmail');
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  };

  // Écran de chargement initial
  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
          <div style={{ fontSize: '14px' }}>Initialisation du Studio Kirov5...</div>
        </div>
      </div>
    );
  }

  // Si non connecté -> affichage de l'écran d'authentification
  if (!user) {
    return <AuthScreen onAuthenticated={(u) => setUser(u)} />;
  }

  // Authentifié -> application principale
  return <App user={user} onLogout={handleLogout} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
