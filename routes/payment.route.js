const express = require("express");
const { protectRoute } = require("../middleware/auth.middleware.js");
const validate = require('../middleware/validate'); // Your validation middleware
const {
    createCheckoutSession,
    checkoutSuccess
} = require("../controllers/payment.controller.js");
const {
    createCheckoutSessionSchema,
    checkoutSuccessSchema
} = require('../validations/payment.validation'); // Import payment validation schemas

const router = express.Router();

// Route for creating a checkout session
router.post("/create-checkout-session", protectRoute, validate(createCheckoutSessionSchema), createCheckoutSession);

// Route for payment success verification
router.post("/checkout-success", protectRoute, validate(checkoutSuccessSchema), checkoutSuccess);

module.exports = router;