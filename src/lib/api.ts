const BASE_URL = 'https://decision-journal.yadavsunil9699.workers.dev';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('decision-journal-token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();

    if (!response.ok) {
      return { error: json.message || json.error || 'Request failed' };
    }

    return { data: json };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

export const api = {
  // Auth
  register: (name: string, email: string, password: string) =>
    request<{ user: { id: string; email: string; name: string }; token: string }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ name, email, password }) }
    ),

  login: (email: string, password: string) =>
    request<{ user: { id: string; email: string; name: string }; token: string }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  // Users
  getUser: (id: string) =>
    request<{ id: string; email: string; name: string }>(`/users/${id}`),

  updateUser: (id: string, data: { name?: string; email?: string }) =>
    request<{ id: string; email: string; name: string }>(
      `/users/${id}`,
      { method: 'PUT', body: JSON.stringify(data) }
    ),

  deleteUser: (id: string) =>
    request<void>(`/users/${id}`, { method: 'DELETE' }),

  // Admin only
  listUsers: () =>
    request<{ id: string; email: string; name: string }[]>('/users'),

  createUser: (data: { name: string; email: string; password: string }) =>
    request<{ id: string; email: string; name: string }>(
      '/users',
      { method: 'POST', body: JSON.stringify(data) }
    ),

  // Roles
  listRoles: () =>
    request<{ id: string; name: string }[]>('/roles'),

  createRole: (name: string) =>
    request<{ id: string; name: string }>(
      '/roles',
      { method: 'POST', body: JSON.stringify({ name }) }
    ),

  updateRole: (id: string, name: string) =>
    request<{ id: string; name: string }>(
      `/roles/${id}`,
      { method: 'PUT', body: JSON.stringify({ name }) }
    ),

  deleteRole: (id: string) =>
    request<void>(`/roles/${id}`, { method: 'DELETE' }),
};
