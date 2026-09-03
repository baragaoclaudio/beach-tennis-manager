import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

const admin = {
  id: 'admin-id',
  email: 'admin@example.com',
  role: 'ADMIN' as const
};

function response(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  } as Response;
}

describe('admin login interface', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the login when there is no existing session', async () => {
    vi.mocked(fetch).mockResolvedValue(response(401, {}));

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Acesso do administrador' })).toBeTruthy();
    expect(fetch).toHaveBeenCalledWith('/auth/me', {
      credentials: 'include',
      cache: 'no-store'
    });
  });

  it('shows the authenticated area for an existing session', async () => {
    vi.mocked(fetch).mockResolvedValue(response(200, { user: admin }));

    render(<App />);

    expect(await screen.findByText('Você está conectado como administrador.')).toBeTruthy();
    expect(screen.getByText(admin.email)).toBeTruthy();
  });

  it('submits credentials with cookies enabled and shows the authenticated area', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response(401, {}))
      .mockResolvedValueOnce(response(200, { user: admin }));

    render(<App />);
    await screen.findByRole('heading', { name: 'Acesso do administrador' });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: admin.email } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(screen.getByText('Você está conectado como administrador.')).toBeTruthy());
    expect(fetch).toHaveBeenLastCalledWith('/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({ email: admin.email, password: 'secret' })
    });
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });

  it('shows a generic message for invalid credentials and clears the password', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response(401, {}))
      .mockResolvedValueOnce(response(401, {}));

    render(<App />);
    await screen.findByRole('heading', { name: 'Acesso do administrador' });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: admin.email } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Email ou senha inválidos.');
    expect((screen.getByLabelText('Senha') as HTMLInputElement).value).toBe('');
  });

  it('shows validation errors from the API', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response(401, {}))
      .mockResolvedValueOnce(response(400, {}));

    render(<App />);
    await screen.findByRole('heading', { name: 'Acesso do administrador' });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Confira os dados informados.');
  });

  it('logs out and returns to the login screen', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(response(200, { user: admin }))
      .mockResolvedValueOnce(response(204, {}));

    render(<App />);
    expect(await screen.findByText('Você está conectado como administrador.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(await screen.findByRole('heading', { name: 'Acesso do administrador' })).toBeTruthy();
    expect(fetch).toHaveBeenLastCalledWith('/auth/logout', {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store'
    });
    expect(screen.queryByText('Você está conectado como administrador.')).toBeNull();
  });
});