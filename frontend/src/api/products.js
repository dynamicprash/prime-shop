import apiClient from '../lib/api.js';

const normalizeProduct = (product) => {
  if (!product) return null;

  const price = Number(product.price);

  return {
    ...product,
    id: product._id || product.id,
    price: Number.isNaN(price) ? product.price : price,
  };
};

export const fetchProducts = async () => {
  const response = await apiClient.get('/product');
  const products = response.data?.data ?? [];
  return products.map(normalizeProduct);
};

export const fetchProductById = async (productId) => {
  const response = await apiClient.get(`/product/${productId}`);
  return normalizeProduct(response.data?.data);
};

export const createProduct = async (payload) => {
  const response = await apiClient.post('/product/add', payload);
  return normalizeProduct(response.data?.data);
};


