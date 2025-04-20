import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import { redis } from '../lib/redis.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'Anjey43210';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'Anjey43210';
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

// User Signup
export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        const accessToken = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: newUser._id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        await redis.set(newUser._id.toString(), refreshToken, 'EX', REFRESH_TOKEN_EXPIRY);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Lax', // Adjusted to 'Lax' for testing
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Lax', // Adjusted to 'Lax' for testing
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// User Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        await redis.set(user._id.toString(), refreshToken, 'EX', REFRESH_TOKEN_EXPIRY);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Lax', // Adjusted to 'Lax' for testing
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Lax', // Adjusted to 'Lax' for testing
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// User Logout
export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
        const userId = decoded.id;

        await redis.del(userId);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// Refresh Token
export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("Request Cookies:", req.cookies); // Debug: Log all cookies

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token not provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const storedToken = await redis.get(decoded.id.toString());

        if (!storedToken || storedToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Lax', // Adjusted to 'Lax' for testing
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
        console.error("Error refreshing token:", error); // Debug: Log the error
        res.status(403).json({ message: 'Invalid refresh token', error: error.message });
    }
};

//get Profile
export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

