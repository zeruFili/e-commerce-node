const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../mailtrap/emails.js");
const generateTokens = require("../utils/generateTokens.js"); // Token generation logic
const jwt = require("jsonwebtoken");

const createUser = async (email, password, first_name, last_name, phone_number) => {
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new Error("User already exists");
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("Saved hashed password when creating a user :", hashedPassword);
  const user = new User({
    email,
    password: hashedPassword, // Save hashed password
    first_name,
    last_name,
    phone_number,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiry
  });

  await user.save();

  // Generate tokens and save the refresh token
  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
   await user.save();
    const Users = await User.findById(user._id);

  // Log the updated user's password
  console.log("Saved hashed password: from the database", Users.password);

  // Send the verification email
  await sendVerificationEmail(user.email, user.verificationToken);

  return { user, accessToken, refreshToken };
};

const verifyUserEmail = async (code) => {
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired verification code");
  }

  // Mark user as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare the plain text password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Login password hash from DB:", user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate new tokens
  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (user) {
      user.refreshToken = null; // Clear refresh token
      await user.save();
    }
  }
};

const resetUserPassword = async (token, password) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: Date.now() }, // Ensure token is still valid
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  // Hash the new password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword; // Update with hashed password
  user.resetPasswordToken = undefined; // Clear reset token
  user.resetPasswordExpiresAt = undefined; // Clear token expiry
console.log("Saved hashed password:", hashedPassword);
  await user.save(); // Save updated user

  // Fetch the updated user from the database
  const updatedUser = await User.findById(user._id);

  // Log the updated user's password
  console.log("Saved hashed password:", updatedUser.password);

  return updatedUser;
};

const sendResetEmail = async (email, resetToken) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour expiry
  await user.save(); // Save reset token and expiry

  await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
};

module.exports = {
  createUser,
  verifyUserEmail,
  loginUser,
  logoutUser,
  resetUserPassword,
  sendResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetSuccessEmail,
};