import { authFetch } from './auth/authClient';
import type { User, AuthResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await authFetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.message || 'Erro ao criar conta');
    }

    return response.json();
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await authFetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.message || 'Erro ao fazer login');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const response = await authFetch(`${API_URL}/auth/logout`, {
      method: 'POST',
    });

    // 204 No Content é sucesso
    if (!response.ok && response.status !== 204) {
      throw new Error('Erro ao fazer logout');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await authFetch(`${API_URL}/users/me`);

    if (!response.ok) {
      throw new ApiError(response.status, 'Erro ao buscar usuário');
    }

    return response.json();
  },
};
