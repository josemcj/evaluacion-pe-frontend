import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  document.title = `${to.meta.title} | Transacciones` || 'Transacciones';

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' };
  }

  if (to.name === 'login' && authStore.isLoggedIn) {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
