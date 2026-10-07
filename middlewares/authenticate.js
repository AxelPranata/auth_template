const jwt = require("jsonwebtoken");
const ms = require("ms")

async function authenticateToken(req, res, next) {
    try {
        // Get access and refresh token from cookie
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        // If both tokens are invalid, return error
        if (!accessToken && !refreshToken) {
            console.log("Authentication required");
            return res.status(401).redirect("/public/sign-in");
        }

        // If access token is invalid but refresh token is available, generate new access token
        if (!accessToken && refreshToken) {
            console.log("Access token expired");
            return refreshAccessToken(req, res, next);
        }

        // Verify if access token is valid
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    // Expired access token
                    console.log("Access token expired");
                    return refreshAccessToken(req, res, next);
                }
                else {
                    // Invalid access token
                    return res.status(401).redirect("/public/sign-in");
                }
            }
            else {
                req.user = decoded;
                return next();
            }
        });
    }
    catch (error) {
        console.error(`Authentication error: ${error}`);
        return res.status(500).json({ message: "Error authenticating token" });
    }
}

async function refreshAccessToken(req, res, next) {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            console.log("Refresh token expired");
            return res.status(401).redirect("/public/sign-in");
        }

        // Verify if refresh token is valid
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                // Invalid refresh token
                console.log("Refresh token expired");
                return res.status(401).redirect("/public/sign-in");
            }
            else {
                // Valid refresh token
                const payload = {
                    username: decoded.Username
                }

                // Send new access token
                const accessToken = jwt.sign(
                    payload,
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
                )

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    maxAge: ms(process.env.ACCESS_TOKEN_EXPIRES_IN)
                })

                console.log("Access token refreshed");
                req.user = decoded;
                return next();
            }
        })
    }
    catch (error) {
        console.error(`Authentication error: ${error}`);
        return res.status(500).json({ message: "Error refreshing token" });
    }
}

module.exports = {
    authenticateToken,
    refreshAccessToken,
}