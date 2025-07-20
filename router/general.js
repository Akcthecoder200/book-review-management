const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get the book list using Promise callbacks
public_users.get("/books/promise", (req, res) => {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(500).json({ message: "Error retrieving books" })
    );
});

// Get the book list using async-await with Axios (self-request)
public_users.get("/books/async", async (req, res) => {
  try {
    // Assuming the server is running on localhost:5000
    const response = await axios.get("http://localhost:5000/");
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books with Axios" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details by ISBN using Promise callbacks
public_users.get("/isbn/promise/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book details by ISBN using async-await with Axios (self-request)
public_users.get("/isbn/async/:isbn", async (req, res) => {
  try {
    // Assuming the server is running on localhost:5000
    const response = await axios.get(
      `http://localhost:5000/isbn/${req.params.isbn}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({ message: "Book not found (Axios)" });
  }
});

// Get book details by author using Promise callbacks
public_users.get("/author/promise/:author", (req, res) => {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found for this author");
    }
  })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book details by author using async-await with Axios (self-request)
public_users.get("/author/async/:author", async (req, res) => {
  try {
    // Assuming the server is running on localhost:5000
    const response = await axios.get(
      `http://localhost:5000/author/${req.params.author}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found for this author (Axios)" });
  }
});

// Get book details by title using Promise callbacks
public_users.get("/title/promise/:title", (req, res) => {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found with this title");
    }
  })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book details by title using async-await with Axios (self-request)
public_users.get("/title/async/:title", async (req, res) => {
  try {
    // Assuming the server is running on localhost:5000
    const response = await axios.get(
      `http://localhost:5000/title/${req.params.title}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found with this title (Axios)" });
  }
});

module.exports.general = public_users;
