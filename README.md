# Book Review Management Express API

## Overview

This project is an Express.js-based RESTful API for managing a book review system. It supports user registration, authentication (with JWT and sessions), book listing, searching, and review management. The API demonstrates the use of Promises and async/await (with Axios) for various endpoints.

## Features

- User registration and login with JWT-based authentication
- Session management using express-session
- List all books in the shop
- Search books by ISBN, author, or title
- Add, update, and delete book reviews (authenticated users only)
- Endpoints using Promises and async/await (Axios) for demonstration

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the server:**
   ```bash
   node index.js
   ```
   The server will run on `http://localhost:5000` by default.

## API Endpoints

### User Authentication

- `POST /customer/login` — Login and receive a session with JWT
- `POST /register` — Register a new user

### Book Listing & Search

- `GET /` — List all books
- `GET /isbn/:isbn` — Get book details by ISBN
- `GET /author/:author` — Get books by author
- `GET /title/:title` — Get books by title

#### Promise & Async/Await Endpoints

- `GET /books/promise` — List all books (Promise)
- `GET /books/async` — List all books (async/await with Axios)
- `GET /isbn/promise/:isbn` — Get book by ISBN (Promise)
- `GET /isbn/async/:isbn` — Get book by ISBN (async/await with Axios)
- `GET /author/promise/:author` — Get books by author (Promise)
- `GET /author/async/:author` — Get books by author (async/await with Axios)
- `GET /title/promise/:title` — Get books by title (Promise)
- `GET /title/async/:title` — Get books by title (async/await with Axios)

### Book Reviews (Authenticated)

- `PUT /customer/auth/review/:isbn` — Add or update a review for a book
- `DELETE /customer/auth/review/:isbn` — Delete your review for a book
- `GET /review/:isbn` — Get all reviews for a book

## Authentication

- Login to receive a session with a JWT token.
- For protected routes (`/customer/auth/*`), include the session cookie in your requests.

## Usage Example

**Register:**

```bash
curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"username":"user1","password":"pass1"}'
```

**Login:**

```bash
curl -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d '{"username":"user1","password":"pass1"}' -c cookies.txt
```

**Add a Review (after login):**

```bash
curl -X PUT http://localhost:5000/customer/auth/review/1 -H "Content-Type: application/json" -d '{"review":"Great book!"}' -b cookies.txt
```

**Delete a Review (after login):**

```bash
curl -X DELETE http://localhost:5000/customer/auth/review/1 -b cookies.txt
```

## Notes

- The book database is in-memory and resets on server restart.
- For demonstration, Axios endpoints make HTTP requests to the same server.
