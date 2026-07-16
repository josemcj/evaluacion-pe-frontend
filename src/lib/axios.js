import axios from 'axios';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      //   const { useAuthStore } = await import('@/stores/auth');
      //   const authStore = useAuthStore();

      //   await Swal.fire({
      //     icon: 'error',
      //     title: 'Sesión expirada',
      //     text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      //     confirmButtonText: 'Aceptar',
      //     allowOutsideClick: false,
      //     allowEscapeKey: false,
      //     allowEnterKey: false,
      //   });

      //   authStore.forceLogout();
      router.push({ name: 'login' });
    }

    return Promise.reject(error);
  },
);

export default api;
