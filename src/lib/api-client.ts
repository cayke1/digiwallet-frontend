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

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {}
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
