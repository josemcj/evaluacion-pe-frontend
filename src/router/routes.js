export default [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      title: 'Iniciar sesión',
      requiresAuth: false,
    },
  },

  /**
   * Rutas protegidas
   */
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  },

  /**
   * Rutas no existentes (404)
   */
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/utility/404.vue'),
    meta: {
      title: 'Página no encontrada',
      requiresAuth: false,
    },
  },
];
