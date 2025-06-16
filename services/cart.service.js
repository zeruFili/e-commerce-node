const Cart = require("../models/cart.model.js");
const Product = require("../models/product.model.js");

const getCartProducts = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
    if (!cart) throw new Error("Cart not found");

    return cart.cartItems.map(item => ({
        ...item.product.toJSON(),
        quantity: item.quantity
    }));
};

const addToCart = async (userId, productId) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, cartItems: [] });
    }

    const existingItem = cart.cartItems.find(item => item.product.equals(productId));
    if (existingItem) {
        if (existingItem.quantity < product.amount) {
            existingItem.quantity += 1;
        } else {
            throw new Error("Not enough product amount available");
        }
    } else {
        if (product.amount > 0) {
            cart.cartItems.push({ product: productId, quantity: 1 });
        } else {
            throw new Error("Not enough product amount available");
        }
    }

    await cart.save();
    return cart.cartItems;
};

const removeAllFromCart = async (userId, productId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    if (!productId) {
        cart.cartItems = [];
    } else {
        cart.cartItems = cart.cartItems.filter(item => !item.product.equals(productId));
    }

    await cart.save();
    return cart.cartItems;
};

const updateQuantity = async (userId, productId, quantity) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    const existingItem = cart.cartItems.find(item => item.product.equals(productId));
    if (!existingItem) throw new Error("Product not found in cart");

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    if (quantity === 0) {
        cart.cartItems = cart.cartItems.filter(item => !item.product.equals(productId));
    } else if (quantity <= product.amount) {
        existingItem.quantity = quantity;
    } else {
        throw new Error("Not enough product amount available");
    }

    await cart.save();
    return cart.cartItems;
};

module.exports = {
    getCartProducts,
    addToCart,
    removeAllFromCart,
    updateQuantity,
};