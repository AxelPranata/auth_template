async function redirectIfAuthenticated(req, res, next) {
    // Public paths
    const publicOnlyPaths = ["/", "/sign-up/", "/sign-in/"];

    // Get access and refresh token from cookie
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // Redirect if user is already signed in and tries to access public pages
    if ((accessToken || refreshToken) && publicOnlyPaths.includes(req.path)) {
        return res.redirect("/protected/");
    }

    return next();
}

module.exports = {
    redirectIfAuthenticated,
}