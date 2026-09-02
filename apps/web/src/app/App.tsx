import { useEffect, useState } from 'react';
import { AuthenticatedView } from '../modules/auth/components/AuthenticatedView';
import { LoginPage } from '../modules/auth/components/LoginPage';
import { getAuthenticatedUser } from '../modules/auth/types';
import type { AuthUser } from '../modules/auth/types';

type SessionState = 'loading' | 'anonymous' | 'authenticated' | 'unavailable';

export function App() {
  const [sessionState, setSessionState] = useState<SessionState>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getAuthenticatedUser()
      .then((authenticatedUser) => {
        if (authenticatedUser) {
          setUser(authenticatedUser);
          setSessionState('authenticated');
        } else {
          setSessionState('anonymous');
        }
      })
      .catch(() => setSessionState('unavailable'));
  }, []);

  if (sessionState === 'loading') {
    return <main className="status-layout"><p>Verificando sua sessão...</p></main>;
  }

  if (sessionState === 'unavailable') {
    return (
      <main className="status-layout">
        <h1>Não foi possível conectar</h1>
        <p>Verifique se a API está disponível e tente novamente.</p>
      </main>
    );
  }

  if (sessionState === 'authenticated' && user) {
    return <AuthenticatedView user={user} />;
  }

  return <LoginPage onAuthenticated={(authenticatedUser) => {
    setUser(authenticatedUser);
    setSessionState('authenticated');
  }} />;
}