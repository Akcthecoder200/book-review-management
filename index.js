const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if the session contains an authorization object with accessToken
  if (!req.session || !req.session.authorization) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  const token = req.session.authorization.accessToken;
  try {
    // Verify JWT
    jwt.verify(token, "fingerprint_customer");
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
