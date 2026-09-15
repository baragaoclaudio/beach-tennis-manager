import { apiRequest, clearRefreshBlock } from './http-client';
import type { AuthUser } from './types';

type AuthResponse = {
  user: AuthUser;
};

export async function loginAdmin(email: string, password: string): Promise<AuthUser> {
  const response = await apiRequest('/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    retryOnUnauthorized: false
  });

  if (!response.ok) {
    throw new Error(response.status === 400 ? 'Confira os dados informados.' : 'Email ou senha inválidos.');
  }

  clearRefreshBlock();
  const data = (await response.json()) as AuthResponse;
  return data.user;
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const response = await apiRequest('/auth/me');

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Não foi possível verificar a sessão.');
  }

  const data = (await response.json()) as AuthResponse;
  return data.user;
}

export async function logout(): Promise<void> {
  const response = await apiRequest('/auth/logout', {
    method: 'POST',
    retryOnUnauthorized: false
  });

  if (!response.ok) {
    throw new Error('Não foi possível encerrar a sessão.');
  }
}
