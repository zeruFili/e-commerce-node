const express = require("express");
const {
    getCartProducts,
    addToCart,
    removeAllFromCart,
    updateQuantity
} = require("../controllers/cart.controller.js");
const { protectRoute } = require("../middleware/auth.middleware.js");
const validate = require('../middleware/validate'); // Your validation middleware
const {
    addToCartSchema,
    updateQuantitySchema,
    removeAllFromCartSchema,
    getCartProductsSchema
} = require('../validations/cart.validation'); // Assuming you created this

const router = express.Router();

// Route for getting cart products
router.get("/", protectRoute, validate(getCartProductsSchema), getCartProducts);

// Route for adding a product to the cart
router.post("/", protectRoute, validate(addToCartSchema), addToCart);

// Route for removing all items from the cart or a specific product
router.delete("/", protectRoute, validate(removeAllFromCartSchema), removeAllFromCart);

// Route for updating the quantity of a product in the cart
router.patch("/:id", protectRoute, validate(updateQuantitySchema), updateQuantity);

module.exports = router;