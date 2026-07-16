<script setup>
import TransactionsTable from './components/TransactionsTable.vue';

const onAddTransaction = () => {
  // Lógica para agregar una transacción
  console.log('Agregar transacción');
};
</script>

<template>
  <h1 class="mb-3">Transacciones</h1>
  <TransactionsTable @add-transaction="onAddTransaction" />
</template>
