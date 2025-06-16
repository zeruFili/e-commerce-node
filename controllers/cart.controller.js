const CartService = require("../services/cart.service.js");
const catchAsync = require("../utils/catchAsync.js");
const httpStatus = require("http-status");

const getCartProducts = catchAsync(async (req, res) => {
    const cartProducts = await CartService.getCartProducts(req.user._id);
    res.json(cartProducts);
});

const addToCart = catchAsync(async (req, res) => {
    const cartItems = await CartService.addToCart(req.user._id, req.body.productId);
    res.json(cartItems);
});

const removeAllFromCart = catchAsync(async (req, res) => {
    const cartItems = await CartService.removeAllFromCart(req.user._id, req.body.productId);
    res.json(cartItems);
});

const updateQuantity = catchAsync(async (req, res) => {
    const cartItems = await CartService.updateQuantity(req.user._id, req.params.id, req.body.quantity);
    res.json(cartItems);
});

module.exports = {
    getCartProducts,
    addToCart,
    removeAllFromCart,
    updateQuantity,
};