import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0, left: 0 };
  },
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Transacciones` || 'Evaluación PE';
  next();
});

export default router;
