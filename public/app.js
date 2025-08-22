// ===== Auth & API helpers =====
const API = {
  tokenKey: 'jwt',
  userKey: 'user',

  setAuth({ token, user }) {
    if (token) localStorage.setItem(this.tokenKey, token);
    if (user) localStorage.setItem(this.userKey, JSON.stringify(user));
  },

  get token() {
    return localStorage.getItem(this.tokenKey);
  },

  get user() {
    try {
      return JSON.parse(localStorage.getItem(this.userKey) || 'null');
    } catch {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  },

  async fetch(path, { method = 'GET', body, headers } = {}) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    };
    if (this.token) opts.headers['Authorization'] = `Bearer ${this.token}`;
    if (body !== undefined) opts.body = JSON.stringify(body);

    const res = await fetch(path, opts);
    const isJSON = res.headers.get('content-type')?.includes('application/json');
    const data = isJSON ? await res.json() : await res.text();
    if (!res.ok) throw new Error(data?.message || data || 'Request failed');
    return data;
  }
};

// ===== Helpers =====
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return alert(msg);
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 2200);
}

function guardAuth(required = true) {
  const u = API.user;
  if (required && !u) {
    location.href = '/login.html';
    return false;
  }
  return true;
}

function fmtPrice(v) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(v);
}

function fmtDT(s) {
  const d = new Date(s);
  return d.toLocaleString();
}

function toLocalDTValue(d) {
  // for datetime-local input value
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ===== Nav sections =====
function renderNav() {
  const u = API.user;
  const navUser = document.getElementById('nav-user');
  const navAdmin = document.getElementById('nav-admin');

  if (navUser) {
    navUser.innerHTML = u
      ? `Hi, ${u.name}`
      : '<a href="/login.html">Log in</a>';
  }

  if (navAdmin) {
    navAdmin.classList.toggle('hidden', !(u && u.role === 'admin'));
  }
}

// ===== Logout =====
function logout() {
  API.clear();
  location.href = '/login.html';
}

// Run once DOM is ready
document.addEventListener('DOMContentLoaded', renderNav);
