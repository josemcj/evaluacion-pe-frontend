<script setup>
import { computed, defineAsyncComponent } from 'vue';
import Layout from '@/components/layout/layout.vue';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();

const OperatorDashboard = defineAsyncComponent(() => import('./operator.vue'));
const SupervisorDashboard = defineAsyncComponent(() => import('./supervisor.vue'));

const componentsByRole = {
  Operador: OperatorDashboard,
  Supervisor: SupervisorDashboard,
};

const DashboardComponent = computed(() => componentsByRole[authStore.role] || null);
</script>

<template>
  <Layout>
    <component :is="DashboardComponent" />
  </Layout>
</template>
