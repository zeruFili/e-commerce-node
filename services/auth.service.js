const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user.model.js");
const {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} = require("../mailtrap/emails.js");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie.js");

const createUser = async (email, password, name) => {
	const userAlreadyExists = await User.findOne({ email });
	if (userAlreadyExists) {
		throw new Error("User already exists");
	}

	const hashedPassword = await bcryptjs.hash(password, 10);
	const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

	const user = new User({
		email,
		password: hashedPassword,
		name,
		verificationToken,
		verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
	});

	await user.save();
	return user;
};

const verifyUserEmail = async (code) => {
	const user = await User.findOne({
		verificationToken: code,
		verificationTokenExpiresAt: { $gt: Date.now() },
	});

	if (!user) {
		throw new Error("Invalid or expired verification code");
	}

	user.isVerified = true;
	user.verificationToken = undefined;
	user.verificationTokenExpiresAt = undefined;
	await user.save();
	return user;
};

const authenticateUser = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Invalid credentials");
	}

	const isPasswordValid = await bcryptjs.compare(password, user.password);
	if (!isPasswordValid) {
		throw new Error("Invalid credentials");
	}

	return user;
};

const resetUserPassword = async (token, password) => {
	const user = await User.findOne({
		resetPasswordToken: token,
		resetPasswordExpiresAt: { $gt: Date.now() },
	});

	if (!user) {
		throw new Error("Invalid or expired reset token");
	}

	const hashedPassword = await bcryptjs.hash(password, 10);
	user.password = hashedPassword;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpiresAt = undefined;
	await user.save();

	return user;
};

const sendResetEmail = async (email, resetToken) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("User not found");
	}

	user.resetPasswordToken = resetToken;
	user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
	await user.save();

	await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
};

module.exports = {
	createUser,
	verifyUserEmail,
	authenticateUser,
	resetUserPassword,
	sendResetEmail,
};