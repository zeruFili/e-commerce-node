const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie.js");
const catchAsync = require("../utils/catchAsync");
const authService = require("../services/auth.service.js");

const signup = catchAsync(async (req, res) => {
	const { email, password, name } = req.body;

	const user = await authService.createUser(email, password, name);
	generateTokenAndSetCookie(res, user._id);
	await sendVerificationEmail(user.email, user.verificationToken);

	res.status(201).json({
		success: true,
		message: "User created successfully",
		user: {
			...user._doc,
			password: undefined,
		},
	});
});

const verifyEmail = catchAsync(async (req, res) => {
	const { code } = req.body;

	const user = await authService.verifyUserEmail(code);
	await sendWelcomeEmail(user.email, user.name);

	res.status(200).json({
		success: true,
		message: "Email verified successfully",
		user: {
			...user._doc,
			password: undefined,
		},
	});
});

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;

	const user = await authService.authenticateUser(email, password);
	generateTokenAndSetCookie(res, user._id);
	user.lastLogin = new Date();
	await user.save();

	res.status(200).json({
		success: true,
		message: "Logged in successfully",
		user: {
			...user._doc,
			password: undefined,
		},
	});
});

const logout = catchAsync(async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
});

const forgotPassword = catchAsync(async (req, res) => {
	const { email } = req.body;
	const resetToken = crypto.randomBytes(20).toString("hex");

	await authService.sendResetEmail(email, resetToken);
	res.status(200).json({ success: true, message: "Password reset link sent to your email" });
});

const resetPassword = catchAsync(async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	const user = await authService.resetUserPassword(token, password);
	await sendResetSuccessEmail(user.email);
	res.status(200).json({ success: true, message: "Password reset successful" });
});

const checkAuth = catchAsync(async (req, res) => {
	const user = await User.findById(req.userId).select("-password");
	if (!user) {
		return res.status(400).json({ success: false, message: "User not found" });
	}

	res.status(200).json({ success: true, user });
});

module.exports = {
	signup,
	verifyEmail,
	login,
	logout,
	forgotPassword,
	resetPassword,
	checkAuth,
};