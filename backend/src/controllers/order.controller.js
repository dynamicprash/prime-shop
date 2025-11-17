import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Order } from '../models/order.models.js';
import { Product } from '../models/product.models.js';

const buildOrderItems = (items, products) =>
  items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId);

    if (!product) {
      throw new ApiError(400, `Product not found: ${item.productId}`);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new ApiError(400, 'Quantity must be a positive integer');
    }

    return {
      product: product._id,
      quantity: item.quantity,
      unitPrice: product.price,
    };
  });

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping } = req.body;

  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  const { phone, streetAddress, city, zipCode } = shipping || {};

  if (![phone, streetAddress, city, zipCode].every((field) => Boolean(field?.trim?.() || field))) {
    throw new ApiError(400, 'Shipping information is incomplete');
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new ApiError(400, 'One or more products are no longer available');
  }

  const orderItems = buildOrderItems(items, products);
  const totalAmount = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const order = await Order.create({
    name: req.user._id,
    email: req.user.email,
    items: orderItems,
    totalAmount,
    phone,
    streetAddress,
    city,
    zipCode,
    status: 'pending', // Will be updated to 'confirmed' after payment verification
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, 'Order created successfully'));
});

export const listOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const orders = await Order.find({ name: req.user._id })
    .populate('items.product', 'name image')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, 'Orders fetched successfully'));
});

export const getOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const order = await Order.findOne({ _id: req.params.orderId, name: req.user._id });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order fetched successfully'));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'manager') {
    throw new ApiError(403, 'Forbidden: Only managers can view all orders');
  }

  const orders = await Order.find()
    .populate('name', 'name email')
    .populate('items.product', 'name image')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, 'All orders fetched successfully'));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'manager') {
    throw new ApiError(403, 'Forbidden: Only managers can update order status');
  }

  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  )
    .populate('name', 'name email')
    .populate('items.product', 'name image');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order status updated successfully'));
});

export const confirmOrderPayment = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, name: req.user._id });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.status !== 'pending') {
    throw new ApiError(400, 'Order is already confirmed or processed');
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status: 'confirmed' },
    { new: true, runValidators: true }
  )
    .populate('name', 'name email')
    .populate('items.product', 'name image');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, 'Order confirmed successfully'));
});


