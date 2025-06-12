const express = require("express");
const {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
} = require("../controllers/auth.controller"); 
const {
	signupSchema,
	loginSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	verifyEmailSchema,
} = require("../validations/auth.validation");
const { verifyToken } = require("../middleware/verifyToken");
const validate = require('../middleware/validate');
const { valid } = require("joi");

const router = express.Router();

// router.get("/check-auth",  verifyToken, checkAuth);
router.post("/signup", validate(signupSchema) ,signup);
router.post("/login", validate(loginSchema) ,login);
router.post("/logout", logout);
router.post("/verify-email", validate(verifyEmailSchema) , verifyEmail);
router.post("/forgot-password",validate(forgotPasswordSchema) , forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema) , resetPassword);

module.exports = router;