// ─── TransitOps API Client ────────────────────────────────────────────────────
// Single module for all backend calls. Every function auto-attaches the JWT,
// parses the response, and throws a typed error on non-2xx so callers can
// catch { message } without inspecting status codes themselves.

const BASE = 'http://localhost:3000/api';

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function request(path, { method = 'GET', body, token } = {}) {
  const storedToken = token ?? localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Use backend's message field so callers display real error text
    const err = new Error(json.message ?? `HTTP ${res.status}`);
    err.status = res.status;
    err.code = json.code;
    throw err;
  }

  return json; // { success, data, message?, meta? }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),

  register: (name, email, password, role) =>
    request('/auth/register', { method: 'POST', body: { name, email, password, ...(role && { role }) } }),

  me: () => request('/auth/me'),
};

// ── Vehicles ──────────────────────────────────────────────────────────────────

export const vehicleApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/vehicles${q ? `?${q}` : ''}`);
  },

  available: () => request('/vehicles/available'),

  get: (id) => request(`/vehicles/${id}`),

  create: (data) => request('/vehicles', { method: 'POST', body: data }),

  update: (id, data) => request(`/vehicles/${id}`, { method: 'PATCH', body: data }),

  delete: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),
};

// ── Drivers ───────────────────────────────────────────────────────────────────

export const driverApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/drivers${q ? `?${q}` : ''}`);
  },

  available: () => request('/drivers/available'),

  get: (id) => request(`/drivers/${id}`),

  create: (data) => request('/drivers', { method: 'POST', body: data }),

  update: (id, data) => request(`/drivers/${id}`, { method: 'PATCH', body: data }),
};

// ── Trips ─────────────────────────────────────────────────────────────────────

export const tripApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/trips${q ? `?${q}` : ''}`);
  },

  get: (id) => request(`/trips/${id}`),

  create: (data) => request('/trips', { method: 'POST', body: data }),

  dispatch: (id) => request(`/trips/${id}/dispatch`, { method: 'POST' }),

  complete: (id, data) =>
    request(`/trips/${id}/complete`, { method: 'POST', body: data }),

  cancel: (id) => request(`/trips/${id}/cancel`, { method: 'POST' }),
};

// ── Maintenance ───────────────────────────────────────────────────────────────

export const maintenanceApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/maintenance${q ? `?${q}` : ''}`);
  },

  create: (data) => request('/maintenance', { method: 'POST', body: data }),

  close: (id) => request(`/maintenance/${id}/close`, { method: 'PATCH' }),
};

// ── Fuel & Expenses ───────────────────────────────────────────────────────────

export const fuelApi = {
  listFuelLogs: (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/fuel-logs${q ? `?${q}` : ''}`);
  },

  createFuelLog: (data) => request('/fuel-logs', { method: 'POST', body: data }),

  listExpenses: (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/expenses${q ? `?${q}` : ''}`);
  },

  createExpense: (data) => request('/expenses', { method: 'POST', body: data }),
};

// ── Reports ───────────────────────────────────────────────────────────────────

export const reportsApi = {
  kpis: () => request('/dashboard/kpis'),

  fuelEfficiency: () => request('/reports/fuel-efficiency'),

  fleetUtilization: () => request('/reports/fleet-utilization'),

  operationalCost: () => request('/reports/operational-cost'),

  vehicleRoi: () => request('/reports/vehicle-roi'),

  exportCsv: () => request('/reports/export.csv'),
};

// ── Users (Fleet Manager only) ────────────────────────────────────────────────

export const userApi = {
  list: () => request('/users'),

  updateRole: (id, role) =>
    request(`/users/${id}/role`, { method: 'PATCH', body: { role } }),
};

// ── Auth helpers (localStorage) ───────────────────────────────────────────────

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem('token');
}

export function storeAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}
