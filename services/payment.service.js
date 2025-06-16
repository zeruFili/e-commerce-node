const Order = require("../models/order.model.js");
const request = require('request');
const chapa = require("../lib/chapa.js");
const Cart = require("../models/cart.model.js");

const createCheckoutSession = async (cartId, userId) => {
    const cart = await Cart.findById(cartId).populate('cartItems.product');
    if (!cart) throw new Error("Cart not found");

    let totalAmount = 0;

    const lineItems = cart.cartItems.map((item) => {
        const amount = Math.round(item.product.price * 100); // Amount in cents
        totalAmount += amount * item.quantity;

        return {
            name: item.product.name,
            image: item.product.image,
            amount: amount,
            quantity: item.quantity,
        };
    });

    // Generate transaction reference
    const tx_ref = await chapa.genTxRef();
    // console.log(tx_ref);

    // Initialize transaction with Chapa
    const options = {
        method: 'POST',
        url: 'https://api.chapa.co/v1/transaction/initialize',
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: (totalAmount / 100).toString(), // Convert to dollars
            currency: 'ETB',
            email: userId.email,
            first_name: userId.first_name,
            last_name: userId.last_name,
            phone_number: userId.phone_number,
            tx_ref: tx_ref,
            callback_url: `http://localhost:3002/api/payment/checkout-success`,
            meta: {
                products: JSON.stringify(lineItems),
                hide_receipt: true,
            },
        }),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (error) {
                return reject(new Error("Payment processing error"));
            }

            const body = JSON.parse(response.body);
            if (response.statusCode === 200 && body.status === 'success') {
                resolve({
                    paymentUrl: body.data.checkout_url,
                    totalAmount,
                    lineItems,
                });
            } else {
                reject(new Error(body.message || "Something went wrong"));
            }
        });
    });
};

const verifyPayment = async (tx_ref, cartId) => {
    const options = {
        method: 'GET',
        url: `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, async (error, response) => {
            if (error) {
                return reject(new Error("Payment verification error"));
            }

            const body = JSON.parse(response.body);
            if (body.status === "success") {
                const cart = await Cart.findById(cartId).populate('cartItems.product');
                if (!cart) {
                    return reject(new Error("Cart not found"));
                }

                const newOrder = new Order({
                    user: cart.user,
                    products: cart.cartItems.map((item) => ({
                        product: item.product._id,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                    totalAmount: body.data.amount / 100,
                    tx_ref: tx_ref,
                });

                await newOrder.save();
                resolve({ orderId: newOrder._id });
            } else {
                reject(new Error(body.message || "Payment verification failed"));
            }
        });
    });
};

module.exports = {
    createCheckoutSession,
    verifyPayment,
};