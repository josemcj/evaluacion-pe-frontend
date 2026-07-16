import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { login as fetchLogin } from '@/api/auth';

const TOKEN_LS_KEY = 'token';
const USER_LS_KEY = 'user';

const decodeToken = (token) => {
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem(USER_LS_KEY);

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_LS_KEY);
    return null;
  }
};

const getRoleFromPayload = (payload) => {
  if (!payload) return null;

  const role = payload.role ?? null;

  if (Array.isArray(role)) {
    return role[0] ?? null;
  }

  return role;
};

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_LS_KEY) || '');
  const user = ref(getUserFromLocalStorage());
  const isLoggedIn = computed(() => token.value && tokenPayload.value);

  const tokenPayload = computed(() => decodeToken(token.value));
  const role = computed(() => getRoleFromPayload(tokenPayload.value));
  const hasRole = (roleName) => role.value === roleName;

  const isOperator = computed(() => role.value === 'Operador');
  const isSupervisor = computed(() => role.value === 'Supervisor');

  const login = async (credentials) => {
    const response = await fetchLogin(credentials);
    const accessToken = response.accessToken ?? null;

    if (!accessToken) {
      throw new Error('El servidor no devolvió un token.');
    }

    const payload = decodeToken(accessToken);

    if (!payload) {
      throw new Error('El servidor devolvió un token inválido.');
    }

    // const decodedRole = getRoleFromPayload(payload);
    token.value = accessToken;
    user.value = response.user ?? {};

    localStorage.setItem(TOKEN_LS_KEY, token.value);
    localStorage.setItem(USER_LS_KEY, JSON.stringify({ name: user.value.name, username: user.value.username }));
  };

  const logout = () => {
    forceLogout();
  };

  const forceLogout = () => {
    token.value = '';
    user.value = null;

    localStorage.removeItem(TOKEN_LS_KEY);
    localStorage.removeItem(USER_LS_KEY);
  };

  return {
    token,
    user,
    isLoggedIn,
    tokenPayload,
    role,
    hasRole,
    isOperator,
    isSupervisor,
    login,
    logout,
  };
});
