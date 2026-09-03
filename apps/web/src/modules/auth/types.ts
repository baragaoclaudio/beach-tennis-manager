export type AuthUser = {
  id: string;
  email: string;
  role: 'ADMIN' | 'PROFESSOR';
};

type AuthResponse = {
  user: AuthUser;
};

export async function loginAdmin(email: string, password: string): Promise<AuthUser> {
  const response = await fetch('/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error(response.status === 400 ? 'Confira os dados informados.' : 'Email ou senha inválidos.');
  }

  const data = (await response.json()) as AuthResponse;
  return data.user;
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const response = await fetch('/auth/me', {
    credentials: 'include',
    cache: 'no-store'
  });

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
  const response = await fetch('/auth/logout', {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Não foi possível encerrar a sessão.');
  }
}