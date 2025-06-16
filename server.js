const express = require('express');
const app = express();
const blogRouter = require('./routes/blog.routes'); // Adjust the path as necessary
const config = require('./config/config'); // Adjust the path as necessary
const authRouter = require('./routes/auth.route');
const { errorHandler, errorConverter } = require('./middleware/error'); // Adjust the path as necessary
const ApiError = require('./utils/ApiError'); // Adjust the path as necessary
const httpStatus = require('http-status');
const {successHandler, errorHandlers} = require('./config/morgan');  
const productRouter = require('./routes/product.route');
const cookieParser = require("cookie-parser");
const cartRouter = require('./routes/cart.route');
const paymentRouter = require('./routes/payment.route');
app.use(successHandler);
app.use(errorHandlers);

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
// Define API routes
app.use('/api/auth', authRouter);
app.use('/api', blogRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/payment', paymentRouter);


// Handle unknown routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.default.NOT_FOUND, 'Not found'));
});

// Error handling middleware
app.use(errorConverter);
app.use(errorHandler);

module.exports = app; // Export the app for use in other files