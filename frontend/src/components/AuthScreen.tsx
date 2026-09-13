

import { useState } from 'react';

interface AuthScreenProps {
  onAuthenticated: (user: { userId: string; email: string; isSuperAdmin?: boolean }) => void;
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const messages: Record<string, string> = {
          INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',
          TOO_MANY_ATTEMPTS: 'Trop de tentatives. Réessayez dans 15 minutes.',
          REGISTRATION_FAILED: 'Cet email est déjà utilisé.',
          PASSWORD_TOO_SHORT: 'Mot de passe trop court (8 caractères minimum).',
        };
        setError(data.error ? (messages[data.error] ?? data.error) : 'Une erreur est survenue.');
        return;
      }

      if (data.token) {
        localStorage.setItem('kirov5_jwt_token', data.token);
      }

      onAuthenticated({ userId: String(data.userId), email, isSuperAdmin: Boolean(data.isSuperAdmin) });

    } catch (err: any) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('Mode local sans Wrangler: Bypass de la connexion pour accès UI.');
        localStorage.setItem('kirov5_jwt_token', 'dev-mock-token');
        onAuthenticated({ userId: 'dev-user-001', email: email || 'dev@local' });
      } else {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: '20px',
    }}>
      {/* Effet de particules en arrière-plan */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            background: `rgba(${i % 2 === 0 ? '139,92,246' : '59,130,246'},0.08)`,
            width: `${200 + i * 80}px`,
            height: `${200 + i * 80}px`,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 16}%`,
            filter: 'blur(60px)',
            animation: `float ${6 + i}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '420px',
      }}>
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            marginBottom: '20px',
            boxShadow: '0 0 40px rgba(139,92,246,0.4)',
            fontSize: '32px',
          }}>
            ⚡
          </div>
          <h1 style={{
            margin: 0, fontSize: '28px', fontWeight: 800,
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}>
            Kirov5 Sovereign Forge
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '8px', fontSize: '14px' }}>
            Plateforme de génération d'applications IA
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}>
          {/* Onglets Login / Register */}
          <div style={{
            display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '12px',
            padding: '4px', marginBottom: '28px',
          }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                  transition: 'all 0.2s ease',
                  background: mode === m ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'transparent',
                  color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              >
                {m === 'login' ? '🔑 Connexion' : '✨ Inscription'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: 500 }}>
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="vous@exemple.com"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: mode === 'register' ? '16px' : '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: 500 }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? "current-password" : "new-password"}
                placeholder={mode === 'register' ? '8 caractères minimum' : '••••••••'}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Confirmer MDP (register uniquement) */}
            {mode === 'register' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: 500 }}>
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.06)', color: '#fff',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
                color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                background: loading ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(139,92,246,0.4)',
              }}
            >
              {loading ? '⏳ Chargement...' : mode === 'login' ? '🚀 Se connecter' : '✨ Créer mon compte'}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            🔒 Connexion sécurisée — Vos données sont chiffrées
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); }
          to { transform: translateY(-30px) scale(1.05); }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}
