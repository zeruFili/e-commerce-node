const express = require("express");
const {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	toggleFeaturedProduct,
	updateProduct
} = require("../controllers/product.controller.js");
const { adminRoute, protectRoute } = require("../middleware/auth.middleware.js");

const router = express.Router();

const { createProductSchema, updateProductSchema, productIdSchema, categorySchema, toggleFeaturedSchema } = require('../validations/product.validation');
const validate = require('../middleware/validate'); // Your validation middleware

// In your routes file
router.post("/", protectRoute, adminRoute, validate(createProductSchema), createProduct);
router.patch("/:id", protectRoute, adminRoute, validate(updateProductSchema), updateProduct); // Updated this line
router.delete("/:id", protectRoute, adminRoute, validate(productIdSchema), deleteProduct);
router.get("/category/:category", validate(categorySchema), getProductsByCategory);
router.patch("/featured/:id", protectRoute, adminRoute, validate(toggleFeaturedSchema), toggleFeaturedProduct);
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommended", getRecommendedProducts);

module.exports = router;