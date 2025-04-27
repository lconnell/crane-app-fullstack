const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options;

  let url = `${API_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new ApiError(response.status, error.message || 'An error occurred');
    }

    return response.json();
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    console.error('API request failed:', err);
    throw new ApiError(500, 'Failed to fetch data from API');
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, data?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    }),

  put: <T>(path: string, data?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
