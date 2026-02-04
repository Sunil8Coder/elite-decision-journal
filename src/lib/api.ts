const BASE_URL = 'https://decision-journal.yadavsunil9699.workers.dev';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiDecision {
  id: string;
  decision: string;
  reasoning: string;
  emotion: string;
  category: string;
  expectedOutcome: string;
  createdAt: string;
  reviewedAt?: string;
  actualOutcome?: string;
  biasDetected?: string[];
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

  // Decisions
  createDecision: (userId: string, data: {
    decision: string;
    reasoning: string;
    emotion: string;
    category: string;
    expectedOutcome: string;
  }) =>
    request<ApiDecision>(
      `/users/${userId}/decision`,
      { method: 'POST', body: JSON.stringify(data) }
    ),

  listDecisions: (userId: string) =>
    request<ApiDecision[]>(`/users/${userId}/decision`),

  getDecision: (userId: string, decisionId: string) =>
    request<ApiDecision>(`/users/${userId}/decision/${decisionId}`),

  reviewDecision: (userId: string, decisionId: string, data: {
    actualOutcome?: string;
    biasDetected?: string[];
    reviewedAt?: string;
  }) =>
    request<ApiDecision>(
      `/users/${userId}/decision/${decisionId}/review`,
      { method: 'PATCH', body: JSON.stringify(data) }
    ),

  deleteDecision: (userId: string, decisionId: string) =>
    request<void>(`/users/${userId}/decision/${decisionId}`, { method: 'DELETE' }),
};
