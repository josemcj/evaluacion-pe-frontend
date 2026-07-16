<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const { user, role, logout } = useAuthStore();
const router = useRouter();

const onLogout = () => {
  logout();
  router.replace({ name: 'login' });
};
</script>

<template>
  <header class="border-bottom bg-white px-4 py-3 d-flex align-items-center justify-content-between">
    <div>
      <div class="fw-semibold">
        {{ user?.name ?? 'Usuario' }}
      </div>

      <small class="text-secondary">Rol: {{ role }}</small>
    </div>

    <BButton variant="outline-danger" size="sm" @click="onLogout">Cerrar sesión</BButton>
  </header>
</template>
