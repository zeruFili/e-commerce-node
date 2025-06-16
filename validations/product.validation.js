const joi = require('joi');

// Schema for creating a product
const createProductSchema = {
  body: joi.object().keys({
    name: joi.string().min(1).required(),
    description: joi.string().min(1).required(),
    price: joi.number().min(0).required(),
    image: joi.string().uri().required(), // Assuming the image is a URL
    category: joi.string().min(1).required(),
    amount: joi.number().min(0).default(0), // Default to 0 if not provided
  }),
};

// Schema for updating a product (optional fields)
const updateProductSchema = {
  body: joi.object().keys({
    name: joi.string().min(1),
    description: joi.string().min(1),
    price: joi.number().min(0),
    image: joi.string().uri(),
    category: joi.string().min(1),
    amount: joi.number().min(0),
  }).min(1), // At least one field must be provided
};

// Schema for fetching a product by ID
const productIdSchema = {
  params: joi.object().keys({
    id: joi.string().required(),
  }),
};

// Schema for fetching products by category
const categorySchema = {
  params: joi.object().keys({
    category: joi.string().min(1).required(),
  }),
};

// Schema for toggling featured status
const toggleFeaturedSchema = {
  params: joi.object().keys({
    id: joi.string().required(),
  }),
};

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  categorySchema,
  toggleFeaturedSchema,
};