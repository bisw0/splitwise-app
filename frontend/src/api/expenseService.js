import apiClient from './apiClient';

export const createExpense = (expenseData) => apiClient.post('/expenses', expenseData);
