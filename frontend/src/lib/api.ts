const API_BASE_URL = 'http://localhost:3000/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | string;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    body:
      options.body && typeof options.body === 'object'
        ? JSON.stringify(options.body)
        : options.body,
  });

  if (!response.ok) {
    const error = new Error(`API error: ${response.statusText}`);
    (error as any).status = response.status;
    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return undefined as T;
}

export async function get<T = unknown>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

export async function post<T = unknown>(
  endpoint: string,
  body?: Record<string, unknown>
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body });
}

export async function patch<T = unknown>(
  endpoint: string,
  body?: Record<string, unknown>
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PATCH', body });
}

export async function del<T = unknown>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}
