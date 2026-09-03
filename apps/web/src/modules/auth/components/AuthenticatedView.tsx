import { logout } from '../types';
import type { AuthUser } from '../types';

type AuthenticatedViewProps = {
  user: AuthUser;
  onLoggedOut: () => void;
};

export function AuthenticatedView({ user, onLoggedOut }: AuthenticatedViewProps) {
  async function handleLogout() {
    try {
      await logout();
      onLoggedOut();
    } catch {
      return;
    }
  }

  return (
    <main className="authenticated-layout">
      <span className="eyebrow">Sessão ativa</span>
      <h1>Bem-vindo ao Beach Tennis Manager</h1>
      <p>Você está conectado como administrador.</p>
      <strong>{user.email}</strong>
      <button type="button" onClick={handleLogout}>Sair</button>
    </main>
  );
}