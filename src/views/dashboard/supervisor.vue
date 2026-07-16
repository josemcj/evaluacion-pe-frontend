<script setup>
import { ref } from 'vue';
import TransactionsTable from './components/TransactionsTable.vue';
import { cancelTransaction, refundTransaction } from '@/api/transactions';

import useSwal from '@/composables/useSwal';

const { warning, success, error } = useSwal();

const transactionsTableRef = ref(null);

const cancellingId = ref(null);
const refundingId = ref(null);

const reloadTransactions = async () => {
  await transactionsTableRef.value?.fecthTransactions();
};

const onCancelTransaction = async (transaction) => {
  cancellingId.value = transaction?.id;

  const confirmed = await warning({
    title: '¿Cancelar transacción?',
    html: `
      <p class="mb-2">
        Se cancelará la transacción con referencia:
      </p>

      <strong>${transaction.financialReference}</strong>

      <p class="mt-3 mb-0">
        Importe:
        <strong>
          ${Number(transaction.amount).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
          })}
        </strong>
      </p>
    `,
    confirmButtonText: 'Sí, cancelar',
    confirmButtonColor: '#dc3545',
  });

  if (!confirmed) return;

  try {
    const response = await cancelTransaction(transaction.id);

    await success({
      title: 'Transacción cancelada',
      text: response.message ?? 'La transacción fue cancelada correctamente.',
    });

    await reloadTransactions();
  } catch (requestError) {
    await error({
      title: 'No fue posible cancelar',
      text: requestError.response?.data?.message ?? 'Ocurrió un error al cancelar la transacción.',
    });
  } finally {
    cancellingId.value = null;
  }
};

const onRefundTransaction = async (transaction) => {
  refundingId.value = transaction.id;

  const confirmed = await warning({
    title: '¿Realizar devolución?',
    html: `
      <p class="mb-2">
        Se realizará la devolución de la transacción:
      </p>

      <strong>${transaction.financialReference}</strong>

      <p class="mt-3 mb-0">
        Importe:
        <strong>
          ${Number(transaction.amount).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
          })}
        </strong>
      </p>
    `,
    confirmButtonText: 'Sí, devolver',
    confirmButtonColor: '#0d6efd',
  });

  if (!confirmed) return;

  try {
    const response = await refundTransaction(transaction.id);

    await success({
      title: 'Devolución realizada',
      text: response.message ?? 'La devolución fue realizada correctamente.',
    });

    await reloadTransactions();
  } catch (requestError) {
    await error({
      title: 'No fue posible realizar la devolución',
      text: requestError.response?.data?.message ?? 'Ocurrió un error al realizar la devolución.',
    });
  } finally {
    refundingId.value = null;
  }
};
</script>

<template>
  <h1 class="mb-3">Transacciones</h1>

  <TransactionsTable
    ref="transactionsTableRef"
    @cancel-transaction="onCancelTransaction"
    @refund-transaction="onRefundTransaction" />
</template>
