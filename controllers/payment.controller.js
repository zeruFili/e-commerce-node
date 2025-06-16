const User = require("../models/user.model.js"); // Make sure to import your User model
const PaymentService = require("../services/payment.service.js");
const catchAsync = require("../utils/catchAsync.js");
const httpStatus = require("http-status");

const createCheckoutSession = catchAsync(async (req, res) => {
    const { cartId } = req.body;
    const userId = req.user._id;

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
        return res.status(httpStatus.default.NOT_FOUND).json({ message: "User not found" });
    }

    const { paymentUrl, totalAmount, lineItems } = await PaymentService.createCheckoutSession(cartId, user);

    res.status(httpStatus.default.OK).json({
        msg: "Order created successfully. Perform payment.",
        paymentUrl,
        totalAmount,
        lineItems,
    });
});

const checkoutSuccess = catchAsync(async (req, res) => {
    const { tx_ref, cartId } = req.body;

    const orderDetails = await PaymentService.verifyPayment(tx_ref, cartId);
    
    res.status(httpStatus.default.OK).json({
        success: true,
        message: "Payment successful, order created.",
        orderId: orderDetails.orderId,
    });
});

module.exports = {
    createCheckoutSession,
    checkoutSuccess,
};