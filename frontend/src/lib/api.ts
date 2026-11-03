import { User, ShortenedURL, PaginatedResponse, AnalyticsSummary } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('curl_token') || localStorage.getItem('linkforge_token');
  return token ? { Authorization: `Token ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred.';
    try {
      const data = await response.json();
      if (typeof data === 'object' && data !== null) {
        if (data.detail) errorDetail = data.detail;
        else if (data.error) errorDetail = data.error;
        else {
          // Flatten field error messages
          const messages = Object.entries(data).map(([field, errs]) => {
            const errStr = Array.isArray(errs) ? errs.join(', ') : String(errs);
            return `${field}: ${errStr}`;
          });
          if (messages.length > 0) errorDetail = messages.join(' | ');
        }
      }
    } catch {
      errorDetail = `Request failed with status ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    async register(payload: { username: string; email?: string; password: string; password_confirm: string }) {
      const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse<{ message: string; token: string; user: User }>(res);
    },

    async login(payload: { username: string; password: string }) {
      const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse<{ message: string; token: string; user: User }>(res);
    },

    async logout() {
      const res = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse<{ message: string }>(res);
    },

    async getUser() {
      const res = await fetch(`${API_BASE_URL}/api/auth/user/`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return handleResponse<User>(res);
    },
  },

  // Link Management
  links: {
    async list(params: { search?: string; is_active?: boolean; status?: string; page?: number } = {}) {
      const query = new URLSearchParams();
      if (params.search) query.set('search', params.search);
      if (params.is_active !== undefined) query.set('is_active', String(params.is_active));
      if (params.status) query.set('status', params.status);
      if (params.page) query.set('page', String(params.page));

      const res = await fetch(`${API_BASE_URL}/api/links/?${query.toString()}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return handleResponse<PaginatedResponse<ShortenedURL>>(res);
    },

    async create(payload: {
      original_url: string;
      custom_alias?: string;
      title?: string;
      description?: string;
      expires_in_days?: number;
      expires_at?: string;
    }) {
      const res = await fetch(`${API_BASE_URL}/api/links/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });
      return handleResponse<ShortenedURL>(res);
    },

    async publicCreate(original_url: string) {
      const res = await fetch(`${API_BASE_URL}/api/public-create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url }),
      });
      return handleResponse<ShortenedURL>(res);
    },

    async update(id: string, payload: Partial<{ title: string; description: string; is_active: boolean; expires_at: string | null }>) {
      const res = await fetch(`${API_BASE_URL}/api/links/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });
      return handleResponse<ShortenedURL>(res);
    },

    async delete(id: string) {
      const res = await fetch(`${API_BASE_URL}/api/links/${id}/`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });
      return handleResponse<void>(res);
    },

    async getAnalytics(id: string) {
      const res = await fetch(`${API_BASE_URL}/api/links/${id}/analytics/`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return handleResponse<AnalyticsSummary>(res);
    },
  },

  // Health
  health: {
    async check() {
      const res = await fetch(`${API_BASE_URL}/api/health/`);
      return handleResponse<{ status: string; database: string; cache: string }>(res);
    },
  },
};
