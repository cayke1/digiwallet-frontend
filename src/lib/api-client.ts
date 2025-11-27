import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiClientOptions extends RequestInit {
  requireAuth?: boolean;
  idempotencyKey?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

type CustomHeaderInit = HeadersInit & {
  "idempotency-key"?: string;
  "Cookie"?: string;
}

async function refreshAccessTokenServer(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Cookie": `refreshToken=${refreshToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const setCookieHeader = response.headers.get("set-cookie");
    if (!setCookieHeader) {
      return null;
    }

    const accessTokenMatch = setCookieHeader.match(/accessToken=([^;]+)/);
    if (!accessTokenMatch) {
      return null;
    }

    return accessTokenMatch[1];
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {},
  isRetry: boolean = false
): Promise<T> {
  const {
    requireAuth = true,
    idempotencyKey = false,
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  const headers: CustomHeaderInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (requireAuth) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      throw new ApiClientError(401, "Não autenticado. Faça login novamente.");
    }

    headers["Cookie"] = `accessToken=${accessToken}`;
  }

  if (idempotencyKey) {
    headers["idempotency-key"] = crypto.randomUUID();
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 && !isRetry && requireAuth) {
        const newAccessToken = await refreshAccessTokenServer();

        if (newAccessToken) {
          const retryHeaders: CustomHeaderInit = {
            ...headers,
            "Cookie": `accessToken=${newAccessToken}`,
          };

          const retryResponse = await fetch(url, {
            ...fetchOptions,
            headers: retryHeaders,
          });

          if (retryResponse.ok) {
            if (retryResponse.status === 204) {
              return undefined as T;
            }
            return await retryResponse.json();
          }
        }
      }

      let errorMessage = "Erro ao processar requisição";

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
      }

      throw new ApiClientError(response.status, errorMessage);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiClientError(
        500,
        "Erro de conexão com o servidor. Verifique sua internet e tente novamente."
      );
    }

    throw new ApiClientError(
      500,
      "Erro inesperado ao processar requisição. Tente novamente."
    );
  }
}
