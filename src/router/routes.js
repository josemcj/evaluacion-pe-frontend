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

  // Rutas protegidas

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
