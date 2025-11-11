import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Product } from '../models/product.models.js';

const registerProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category } = req.body;

  if ([name, price, description, image, category].some((field) => !String(field || '').trim())) {
    throw new ApiError(400, 'All fields are required');
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    throw new ApiError(400, 'Price must be a positive number');
  }

  try {
    new URL(image);
  } catch (err) {
    throw new ApiError(400, 'Image must be a valid URL');
  }

  const createdBy = req.user?._id;

  if (!createdBy) {
    throw new ApiError(401, 'Not authenticated');
  }

  const product = await Product.create({
    name,
    price: numericPrice,
    description,
    image,
    category,
    createdBy,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, 'Product created successfully'));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, products, 'Products fetched successfully'));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export { registerProduct, getAllProducts, getProductById };