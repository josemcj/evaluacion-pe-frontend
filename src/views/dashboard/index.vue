<script setup>
import { computed } from 'vue';
import Layout from '@/components/layout/layout.vue';
import OperatorDashboard from './operator.vue';
import SupervisorDashboard from './supervisor.vue';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();

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
