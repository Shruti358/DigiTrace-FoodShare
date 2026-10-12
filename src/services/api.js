const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'digitrace_auth_token';

export const getAuthToken = () => window.sessionStorage.getItem(TOKEN_KEY);

export const setAuthToken = (token) => window.sessionStorage.setItem(TOKEN_KEY, token);

export const clearAuthToken = () => window.sessionStorage.removeItem(TOKEN_KEY);

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAuthToken();

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('Unable to reach the DigiTrace backend. Check that it is running and try again.');
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

export const authApi = {
  register: (userData) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  currentUser: () => apiRequest('/auth/me'),
};

export const foodRecordsApi = {
  list: () => apiRequest('/food-records'),
  create: (record) =>
    apiRequest('/food-records', { method: 'POST', body: JSON.stringify(record) }),
  update: (recordId, record) =>
    apiRequest(`/food-records/${encodeURIComponent(recordId)}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    }),
  delete: (recordId) =>
    apiRequest(`/food-records/${encodeURIComponent(recordId)}`, { method: 'DELETE' }),
};

export const surplusApi = {
  list: () => apiRequest('/surplus-listings'),
  get: (listingId) => apiRequest(`/surplus-listings/${encodeURIComponent(listingId)}`),
  create: (listing) =>
    apiRequest('/surplus-listings', { method: 'POST', body: JSON.stringify(listing) }),
  update: (listingId, changes) =>
    apiRequest(`/surplus-listings/${encodeURIComponent(listingId)}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
    }),
  request: (listingId, requestData) =>
    apiRequest(`/surplus-listings/${encodeURIComponent(listingId)}/requests`, {
      method: 'POST',
      body: JSON.stringify(requestData),
    }),
};