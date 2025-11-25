import { tokenManager } from './tokenManager';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function refreshAccessToken(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('SESSION_EXPIRED');
  }
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const config: RequestInit = {
    ...options,
    credentials: 'include',
  };

  let response = await fetch(url, config);


  if (response.status === 401 && !url.includes('/auth/')) {
    if (tokenManager.isRefreshing()) {
      await tokenManager.getRefreshPromise();
      return fetch(url, config);
    }

    tokenManager.setRefreshing(true);
    const refreshPromise = refreshAccessToken();
    tokenManager.setRefreshPromise(refreshPromise);

    try {
      await refreshPromise;
      response = await fetch(url, config); // Retenta
    } catch (error) {
      tokenManager.reset();
      throw error;
    }

    tokenManager.reset();
  }

  return response;
}
