const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  // Check if username is not already taken
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  // Check if username and password match a registered user
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credential" });
  }
  // Generate JWT
  let accessToken = jwt.sign({ data: username }, "fingerprint_customer", {
    expiresIn: 60 * 60,
  });
  // Store JWT in session
  req.session.authorization = { accessToken };
  return res.status(200).json({ message: "Login successful" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }
  // Get username from JWT in session
  let username;
  try {
    const token = req.session.authorization.accessToken;
    const decoded = jwt.verify(token, "fingerprint_customer");
    username = decoded.data;
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
  // Add or update review
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res
      .status(200)
      .json({ message: "Review added/updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review by the authenticated user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Check authentication
  if (!req.session || !req.session.authorization) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  let username;
  try {
    const token = req.session.authorization.accessToken;
    const decoded = jwt.verify(token, "fingerprint_customer");
    username = decoded.data;
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
