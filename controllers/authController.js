const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ms = require("ms");
const authModel = require("../models/authModel");

async function signUp(req, res) {
    try {
        // User data
        const username = req.body.username.trim();
        const email = req.body.email.trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(req.body.password.trim(), 10);

        // Get user by email
        const user = await authModel.getUserByEmail(email);

        // Check if user exists
        if (user) {
            return res.status(403).json({ message: "User with email already exists" });
        }

        // Create new user
        await authModel.createUser(username, email, hashedPassword);

        return res.status(201).json({ message: "Successfully signed up user" });
    }
    catch (error) {
        console.error(`Controller error: ${error}`);
        res.status(500).json({ message: "Error signing up user" });
    }
}

async function signIn(req, res) {
    try {
        // User data
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password.trim();

        // Get user by email
        const user = await authModel.getUserByEmail(email);

        // Check if user exists
        if (user == null) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.PasswordHash);

        if (isMatch) {

            const payload = {
                username: user.username
            }

            // Create access token
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
            )

            // Create refresh token
            const refreshToken = jwt.sign(
                payload,
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
            )

            // Access token in an HttpOnly cookie
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: ms(process.env.ACCESS_TOKEN_EXPIRES_IN)
            })

            // Refresh token in an HttpOnly cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN)
            })

            delete user.PasswordHash
            return res.status(200).json({ user: user });
        }
        else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    }
    catch (error) {
        console.error(`Controller error: ${error}`);
        res.status(500).json({ message: "Error signing in user" });
    }
}

async function signOut(req, res) {
    try {
        // Clear cookies
        res.clearCookie("accessToken", {
            httpOnly: true,
            maxAge: ms(process.env.ACCESS_TOKEN_EXPIRES_IN)
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN)
        })

        res.status(200).json({ message: "Signed out successfully" });

    }
    catch (error) {
        console.error(`Controller error: ${error}`);
        res.status(500).json({ message: "Error signing out user" });
    }
}

module.exports = {
    signUp,
    signIn,
    signOut,
}