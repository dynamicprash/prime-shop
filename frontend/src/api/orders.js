import apiClient from '../lib/api.js';

export const createOrder = async ({ items, shipping }) => {
  const response = await apiClient.post('/orders', {
    items,
    shipping,
  });

  return response.data?.data;
};

export const fetchOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data?.data ?? [];
};

export const fetchOrderById = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data?.data;
};


