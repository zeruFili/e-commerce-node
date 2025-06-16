const joi = require('joi');

// Schema for adding a product to the cart
const addToCartSchema = {
  body: joi.object().keys({
    productId: joi.string().required(), // Product ID must be provided
  }),
};

// Schema for updating the quantity of a product in the cart
const updateQuantitySchema = {
  params: joi.object().keys({
    id: joi.string().required(), // Product ID must be provided
  }),
  body: joi.object().keys({
    quantity: joi.number().integer().min(0).required(), // Quantity must be a non-negative integer
  }),
};

// Schema for removing all items from the cart (optional product ID)
const removeAllFromCartSchema = {
  body: joi.object().keys({
    productId: joi.string().optional(), // Product ID is optional
  }),
};

// Schema for fetching cart products (no parameters required)
const getCartProductsSchema = {
  params: joi.object().keys({}),
};

module.exports = {
  addToCartSchema,
  updateQuantitySchema,
  removeAllFromCartSchema,
  getCartProductsSchema,
};