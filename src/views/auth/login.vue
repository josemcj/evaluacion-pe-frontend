<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import useSwal from '@/composables/useSwal';

const authStore = useAuthStore();
const router = useRouter();
const swal = useSwal();

const form = reactive({
  username: '',
  password: '',
});
const isLoading = ref(false);

const submit = async () => {
  /**
   * TODO: Validar formulario
   */

  isLoading.value = true;

  try {
    const response = await authStore.login(form);
    await router.replace({ name: 'dashboard' });
  } catch (error) {
    const message = error.response?.data?.message || 'Ocurrió un error al iniciar sesión.';
    swal.toast(message, { icon: 'error' });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <main class="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
    <BCard class="shadow-sm border-0 p-4">
      <div class="text-center mb-4">
        <h1 class="h3 mb-1">Iniciar sesión</h1>

        <p class="text-secondary mb-0">Ingresa tus credenciales para continuar</p>
      </div>

      <!-- <BAlert v-if="errorMessage" variant="danger" :model-value="true">
        {{ errorMessage }}
      </BAlert> -->

      <BForm @submit.prevent="submit">
        <BFormGroup label="Usuario" label-for="username" class="mb-3">
          <BFormInput
            id="username"
            v-model="form.username"
            autocomplete="username"
            placeholder="Ingresa tu usuario"
            :disabled="isLoading" />
        </BFormGroup>

        <BFormGroup label="Contraseña" label-for="password" class="mb-4">
          <BFormInput
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            placeholder="Ingresa tu contraseña"
            :disabled="isLoading" />
        </BFormGroup>

        <BButton type="submit" variant="primary" class="w-100" :disabled="isLoading">
          <BSpinner v-if="isLoading" small class="me-2" />
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </BButton>
      </BForm>

      <hr class="my-4" />

      <div class="small text-secondary">
        <p class="mb-1">
          <strong>Operador:</strong>
          operador / operador123
        </p>

        <p class="mb-0">
          <strong>Supervisor:</strong>
          supervisor / supervisor123
        </p>
      </div>
    </BCard>
  </main>
</template>
