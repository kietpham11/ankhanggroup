export const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, '');

async function parseJsonResponse(res: Response) {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    throw new Error(
      text
        ? `API tra ve du lieu khong hop le: ${text.slice(0, 120)}`
        : 'API tra ve du lieu khong hop le.'
    );
  }
  return res.json();
}

async function fetchJson(url: string, options: RequestInit, fallbackMessage: string) {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error('Khong ket noi duoc API. Hay kiem tra VITE_API_URL, Render server va CORS.');
  }

  const data = await parseJsonResponse(res);
  if (!res.ok) throw new Error(data.error || fallbackMessage);
  return data;
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('gl_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetchJson(
    `${BASE_URL}${endpoint}`,
    { ...options, headers },
    'Da co loi xay ra.'
  );
}

async function submitForm(endpoint: string, formData: FormData, fallbackMessage: string, method = 'POST', withAuth = true) {
  const token = localStorage.getItem('gl_token');
  const headers: HeadersInit = withAuth && token ? { Authorization: `Bearer ${token}` } : {};
  return fetchJson(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: formData,
  }, fallbackMessage);
}

export const getFullImgUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN}${normalizedPath}`;
};

// ====================== AUTH ======================
export const authAPI = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  me: () => request('/auth/me'),
};

// ====================== PROPERTIES ======================
export const propertiesAPI = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/properties${qs}`);
  },
  getBySlug: (slug: string) => request(`/properties/${slug}`),
  getById: (id: number) => request(`/properties/${id}`),
  create: (data: Record<string, unknown>) =>
    request('/properties', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request(`/properties/${id}`, { method: 'DELETE' }),
  toggleFavorite: (id: number) =>
    request(`/properties/${id}/favorite`, { method: 'POST' }),
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return submitForm('/properties/upload', formData, 'Loi khi upload anh.');
  },
};

// ====================== PROJECTS ======================
export const projectsAPI = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/projects${qs}`);
  },
  getBySlug: (slug: string) => request(`/projects/${slug}`),
  create: (data: Record<string, unknown>) =>
    request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request(`/projects/${id}`, { method: 'DELETE' }),
};

// ====================== POSTS ======================
export const postsAPI = {
  getAll: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    return request(`/posts${qs}`);
  },
  getAllAdmin: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    return request(`/posts/admin${qs}`);
  },
  getBySlug: (slug: string) => request(`/posts/${slug}`),
  getCategories: () => request('/posts/categories/all'),
  createCategory: (data: any) => request('/posts/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: number, data: any) => request(`/posts/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: number) => request(`/posts/categories/${id}`, { method: 'DELETE' }),
  create: async (formData: FormData) =>
    submitForm('/posts', formData, 'Loi xay ra'),
  update: async (id: number, formData: FormData) =>
    submitForm(`/posts/${id}`, formData, 'Loi xay ra', 'PUT'),
  delete: (id: number) =>
    request(`/posts/${id}`, { method: 'DELETE' }),
};

// ====================== CONTACTS ======================
export const contactsAPI = {
  send: (data: { name: string; email: string; phone: string; message: string; propertyId?: number }) =>
    request('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  getAll: (status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return request(`/contacts${qs}`);
  },
  updateStatus: (id: number, status: string) =>
    request(`/contacts/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  delete: (id: number) =>
    request(`/contacts/${id}`, { method: 'DELETE' }),
};

// ====================== DASHBOARD ======================
export const dashboardAPI = {
  getStats: (days?: number) => request(days ? `/dashboard/stats?days=${days}` : '/dashboard/stats'),
};

// ====================== LEADERSHIP (MEMBERS) ======================
export const membersAPI = {
  getAll: () => request('/members'),
  create: (data: any) => request('/members', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/members/${id}`, { method: 'DELETE' }),
};

// ====================== JOBS (RECRUITMENT) ======================
export const jobsAPI = {
  getAll: () => request('/jobs'),
  getById: (id: number) => request(`/jobs/${id}`),
  create: (data: any) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/jobs/${id}`, { method: 'DELETE' }),
};

// ====================== CANDIDATES ======================
export const candidatesAPI = {
  getAll: () => request('/jobs/candidates/all'),
  create: (jobId: number, data: any) => request(`/jobs/${jobId}/candidates`, { method: 'POST', body: JSON.stringify(data) }),
  applyWithFile: async (jobId: number, formData: FormData) =>
    submitForm(`/jobs/${jobId}/candidates`, formData, 'Da co loi xay ra.', 'POST', false),
  updateStatus: (id: number, status: string) => request(`/jobs/candidates/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// ====================== SETTINGS ======================
export const settingsAPI = {
  get: (key: string) => request(`/settings/${key}`),
  update: (key: string, data: any) => request(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value: data }) }),
  uploadBanner: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return submitForm('/settings/upload', formData, 'Loi khi upload anh.');
  },
};
