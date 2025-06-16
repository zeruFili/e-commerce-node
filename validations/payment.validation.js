const joi = require('joi');


const createCheckoutSessionSchema = {
    body: joi.object().keys({
        cartId: joi.string().required(), // Cart ID must be provided
        couponCode: joi.string().optional(), // Coupon code is optional
    }),
};


const checkoutSuccessSchema = {
    body: joi.object().keys({
        tx_ref: joi.string().required(), // Transaction reference must be provided
        cartId: joi.string().required(), // Cart ID must be provided
    }),
};

module.exports = {
    createCheckoutSessionSchema,
    checkoutSuccessSchema,
};