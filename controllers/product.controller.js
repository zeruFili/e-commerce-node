const ProductService = require("../services/product.service.js");
const catchAsync = require("../utils/catchAsync.js");
const httpStatus = require("http-status"); // Assuming you're using a package for HTTP status codes

const getAllProducts = catchAsync(async (req, res) => {
  const products = await ProductService.getAllProducts();
  res.json({ products });
});

const getFeaturedProducts = catchAsync(async (req, res) => {
  const products = await ProductService.getFeaturedProducts();

  if (!products.length) {
    return res.status(httpStatus.default.NOT_FOUND).json({ message: "No featured products found" });
  }

  res.json(products);
});

const createProduct = catchAsync(async (req, res) => {
  const product = await ProductService.createProduct(req.body);
  res.status(httpStatus.default.CREATED).json(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const updates = req.body;
  const product = await ProductService.updateProduct(req.params.id, updates);

  if (!product) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "Product not found" });
  }

  res.json(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await ProductService.deleteProduct(req.params.id);

  if (!product) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted successfully" });
});

const getRecommendedProducts = catchAsync(async (req, res) => {
  const products = await ProductService.getRecommendedProducts();
  res.json(products);
});

const getProductsByCategory = catchAsync(async (req, res) => {
  const products = await ProductService.getProductsByCategory(req.params.category);
  res.json({ products });
});

const toggleFeaturedProduct = catchAsync(async (req, res) => {
  const updatedProduct = await ProductService.toggleFeaturedStatus(req.params.id);
  res.json(updatedProduct);
});

const increaseProductAmount = catchAsync(async (req, res) => {
  const product = await ProductService.increaseProductAmount(req.params.id);
  res.json(product);
});

const decreaseProductAmount = catchAsync(async (req, res) => {
  const product = await ProductService.decreaseProductAmount(req.params.id);
  res.json(product);
});

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  updateProduct, // Added this line
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
  increaseProductAmount,
  decreaseProductAmount,
};