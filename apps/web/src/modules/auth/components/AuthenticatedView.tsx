import type { AuthUser } from '../types';

type AuthenticatedViewProps = {
  user: AuthUser;
};

export function AuthenticatedView({ user }: AuthenticatedViewProps) {
  return (
    <main className="authenticated-layout">
      <span className="eyebrow">Sessão ativa</span>
      <h1>Bem-vindo ao Beach Tennis Manager</h1>
      <p>Você está conectado como administrador.</p>
      <strong>{user.email}</strong>
    </main>
  );
}