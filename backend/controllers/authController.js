import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  organizationName: user.organizationName,
  address: user.address,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const ensureDatabase = () => {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error("Database unavailable");
    error.statusCode = 503;
    throw error;
  }
};

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    const error = new Error("Authentication is not configured");
    error.statusCode = 500;
    throw error;
  }

  return process.env.JWT_SECRET;
};

const createToken = (user, secret) =>
  jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: "7d" });

const sendDuplicateEmail = (response) =>
  response.status(409).json({ success: false, message: "An account with this email already exists" });

export const register = async (request, response, next) => {
  try {
    const { name, email, password, role, phone, organizationName, address } = request.body || {};
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (typeof name !== "string" || !name.trim() || !normalizedEmail || typeof password !== "string") {
      return response.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    if (!emailPattern.test(normalizedEmail)) {
      return response.status(400).json({ success: false, message: "A valid email address is required" });
    }

    if (!strongPasswordPattern.test(password)) {
      return response.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol characters",
      });
    }

    const selectedRole = role || "FOOD_PROVIDER";
    if (!['FOOD_PROVIDER', 'NGO'].includes(selectedRole)) {
      return response.status(400).json({ success: false, message: "Role must be FOOD_PROVIDER or NGO" });
    }

    ensureDatabase();
    const jwtSecret = getJwtSecret();
    if (await User.exists({ email: normalizedEmail })) {
      return sendDuplicateEmail(response);
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: selectedRole,
      phone,
      organizationName,
      address,
    });
    const token = createToken(user, jwtSecret);

    return response.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user: safeUser(user), token },
    });
  } catch (error) {
    if (error.code === 11000) {
      return sendDuplicateEmail(response);
    }
    return next(error);
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body || {};
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || typeof password !== "string") {
      return response.status(400).json({ success: false, message: "Email and password are required" });
    }

    ensureDatabase();
  const jwtSecret = getJwtSecret();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return response.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user, jwtSecret);
    return response.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: safeUser(user), token },
    });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (request, response, next) => {
  try {
    ensureDatabase();
    const user = await User.findById(request.user.userId);

    if (!user) {
      return response.status(401).json({ success: false, message: "User no longer exists" });
    }

    return response.status(200).json({
      success: true,
      message: "Current user retrieved",
      data: { user: safeUser(user) },
    });
  } catch (error) {
    return next(error);
  }
};