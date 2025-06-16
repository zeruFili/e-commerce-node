const Product = require("../models/product.model.js");

const createProduct = async (data) => {
  const { name, description, price, image, category, amount } = data;

  const product = new Product({
    name,
    description,
    price,
    image,
    category,
    amount,
  });

  await product.save();
  return product;
};

const getAllProducts = async () => {
  return await Product.find({});
};

const getFeaturedProducts = async () => {
  return await Product.find({ isFeatured: true }).lean();
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const updateProduct = async (id, updates) => {
  return await Product.findByIdAndUpdate(id, updates, { new: true });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

const getRecommendedProducts = async () => {
  return await Product.aggregate([
    { $sample: { size: 4 } },
    { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } },
  ]);
};

const getProductsByCategory = async (category) => {
  return await Product.find({ category });
};

const toggleFeaturedStatus = async (id) => {
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");

  product.isFeatured = !product.isFeatured;
  return await product.save();
};

const increaseProductAmount = async (id) => {
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");

  product.amount += 1;
  await product.save();
  return product;
};

const decreaseProductAmount = async (id) => {
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");

  if (product.amount > 0) {
    product.amount -= 1;
    await product.save();
    return product;
  } else {
    throw new Error("Amount cannot be less than zero");
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedStatus,
  increaseProductAmount,
  decreaseProductAmount,
};