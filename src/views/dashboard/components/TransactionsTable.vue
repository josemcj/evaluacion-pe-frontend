<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { getTransactions } from '@/api/transactions';
import { useAuthStore } from '@/stores/auth';
import { XCircleIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['add-transaction', 'cancel-transaction', 'refund-transaction']);

const authStore = useAuthStore();

const baseFields = [
  { key: 'id', label: 'ID' },
  { key: 'cardholder', label: 'Cliente' },
  { key: 'approvalNumber', label: 'Número de aprobación' },
  { key: 'maskedCard', label: 'Tarjeta' },
  { key: 'amount', label: 'Monto' },
  { key: 'createdAt', label: 'Fecha' },
  { key: 'status', label: 'Estado' },
];
const tableFields = computed(() => {
  if (authStore.isSupervisor) {
    return [
      ...baseFields,
      { key: 'financialReference', label: 'Referencia financiera' },
      { key: 'actions', label: 'Acciones' },
    ];
  }
  return baseFields;
});
const filter = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const totalRows = computed(() => tableRef.value?.items.length ?? transactions.value.length);

const tableRef = useTemplateRef('tableRef');

const transactions = ref([]);
const loading = ref(false);
const error = ref(null);

const fecthTransactions = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await getTransactions();
    transactions.value = response.data;
  } catch (err) {
    error.value = 'Error al cargar las transacciones';
  } finally {
    loading.value = false;
  }
};

defineExpose({
  fecthTransactions,
});

onMounted(fecthTransactions);
</script>

<template>
  <div class="mt-3">
    <BRow>
      <BCol md="4" sm="12">
        <BButton v-if="authStore.isOperator" class="mb-3" variant="primary" @click="emit('add-transaction')">
          Agregar transacción
        </BButton>
      </BCol>

      <BCol md="8">
        <BRow class="mb-3 g-3">
          <BCol md="6" sm="12">
            <BFormInput id="filter-input" v-model="filter" type="search" placeholder="Buscar..." />
          </BCol>
          <BCol md="6" sm="12">
            <div class="d-flex align-items-center justify-content-end">
              Mostrar
              <BFormSelect
                id="per-page-select"
                class="mx-2"
                v-model="perPage"
                :options="[
                  { value: 5, text: '5' },
                  { value: 10, text: '10' },
                  { value: 15, text: '15' },
                ]" />
              elementos
            </div>
          </BCol>
        </BRow>
      </BCol>
    </BRow>

    <BTable
      ref="tableRef"
      striped
      :responsive="true"
      hover
      :items="transactions"
      :fields="tableFields"
      :busy="loading"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage">
      <template #cell(status)="data">
        <BBadge
          :variant="
            {
              'Venta realizada': 'success',
              Cancelado: 'danger',
              Devolución: 'warning',
            }[data.item.status] || 'secondary'
          ">
          {{ data.item.status }}
        </BBadge>
      </template>

      <template #empty>
        <div class="text-center text-muted py-3">
          <p v-if="loading">Cargando transacciones...</p>
          <p v-else-if="error">{{ error }}</p>
          <p v-else>No hay transacciones disponibles.</p>
        </div>
      </template>

      <template #cell(createdAt)="data">
        {{ new Date(data.item.createdAt).toLocaleString() }}
      </template>

      <template #cell(actions)="data">
        <div class="d-flex gap-2">
          <BButton
            v-if="data.item.status === 'Venta realizada'"
            variant="outline-danger"
            size="sm"
            title="Cancelar venta"
            @click="emit('cancel-transaction', data.item)">
            <XCircleIcon class="action-icon" />
          </BButton>

          <BButton
            v-if="data.item.status === 'Venta realizada'"
            variant="outline-primary"
            size="sm"
            title="Realizar devolución"
            @click="emit('refund-transaction', data.item)">
            <ArrowUturnLeftIcon class="action-icon" />
          </BButton>
        </div>
      </template>
    </BTable>

    <BPagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="center" />
  </div>
</template>

<style scoped>
.action-icon {
  width: 20px;
  height: 20px;
}
</style>
