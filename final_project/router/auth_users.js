const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const app = express();
app.use(express.json());
app.use('/customer', regd_users); // Assuming the login route is under '/customer' path

let users = [
    { username: "test", password: "test123" }, // Example user data
    { username: "user2", password: "password2" }
];

const isValid = (username) => {
    // Write code to check if the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    // Write code to check if username and password match the one we have in records
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username and password are valid
    if (!isValid(username) || !authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

     // Return success message
     res.status(200).send("Customer successfully logged in");
});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.body.username; // Assuming username is sent in the request body

    // Check if the book with the given ISBN exists
    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the review for the given ISBN exists for the current user
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    if (books[isbn].reviews.hasOwnProperty(username)) {
        // If the user has already reviewed the book, modify the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review updated successfully" });
    } else {
        // If the user hasn't reviewed the book yet, add a new review
        books[isbn].reviews[username] = review;
        return res.status(201).json({ message: "Review added successfully" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
