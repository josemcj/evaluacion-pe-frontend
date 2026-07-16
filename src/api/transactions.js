import api from '@/lib/axios';

export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions/create', transactionData);
  return response.data;
};

export const cancelTransaction = async (transactionId) => {
  const response = await api.patch(`/transactions/${transactionId}/cancel`);
  return response.data;
};

export const refundTransaction = async (transactionId) => {
  const response = await api.patch(`/transactions/${transactionId}/refund`);
  return response.data;
};
