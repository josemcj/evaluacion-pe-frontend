export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      title: 'Iniciar sesión',
      requiresAuth: false,
    },
  },
];
