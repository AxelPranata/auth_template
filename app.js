// Modules
const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");
const path = require("path");
dotenv.config();



// Set Up
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieparser());



// Middlewares
const authenticate = require("./middlewares/authenticate");
const redirect = require("./middlewares/redirect");

// Controllers
const authController = require("./controllers/authController");



// Pages
// Protected pages require authentication
const protectedRouter = express.Router();
protectedRouter.use(authenticate.authenticateToken);
protectedRouter.use(express.static(path.join(__dirname, "public", "protected")));
app.use("/protected", protectedRouter);

// Public pages do not require authentication
// Tries to redirect automatically if user is signed in
const publicRouter = express.Router();
publicRouter.use(redirect.redirectIfAuthenticated);
publicRouter.use(express.static(path.join(__dirname, "public", "public")));
app.use("/public", publicRouter);

app.use(express.static(path.join(__dirname, "public")));



// Routes
app.post("/auth/signup", authController.signUp);
app.post("/auth/signin", authController.signIn);
app.get("/auth/signout", authController.signOut);



// Server
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
});

process.on("SIGINT", async () => {
    console.log("Server is shutting down...");
    await sql.close();
    console.log("Connection closed.");
    process.exit(0);
});