<script setup>
import { ref } from 'vue';
import TransactionsTable from './components/TransactionsTable.vue';
import CreateTransactionModal from './components/CreateTransactionModal.vue';

const showCreateTransactionModal = ref(false);

const onAddTransaction = () => {
  showCreateTransactionModal.value = true;
};
</script>

<template>
  <h1 class="mb-3">Transacciones</h1>
  <TransactionsTable @add-transaction="onAddTransaction" />

  <CreateTransactionModal v-model="showCreateTransactionModal" />
</template>
