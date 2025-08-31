import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', 
    });
};

// Controller function for user registration
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        // Check if the user with the provided email already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            // If the user exists, return a 400 (Bad Request) status
            return res.status(400).json({ message: 'User with that email already exists' });
        }

        // Create a new user in the database. The password will be hashed by the pre-save hook.
        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            // If the user is successfully created, generate a token and save it as a cookie.
            const token = generateToken(user._id);
            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict', 
                maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            });

            // Return user details without the token in the body
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
            });
        } else {
            // If creation fails for any other reason, return a 400 (Bad Request) status
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller function for user login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Find the user by their email
        const user = await User.findOne({ email });

        // Check if the user exists and if the provided password matches the hashed password
        if (user && (await user.matchPassword(password))) {
            // If credentials are valid, generate a token and save it as a cookie.
            const token = generateToken(user._id);
            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict', 
                maxAge: 1 * 24 * 60 * 60 * 1000, 
            });

            // Return user details without the token in the body
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
            });
        } else {
            // If credentials are invalid, return a 401 (Unauthorized) status
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logout successful" });
}