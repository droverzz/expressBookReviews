const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const general = express.Router();
const public_users = express.Router();




public_users.get('/books', async (req, res) => {
    try {
        // Send the list of books as a response
        res.status(200).json(books);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching books:', error.message);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add the new user to the users array
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('https://droverzz2546-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books');

        // Extract the books data from the response
        const books = response.data;
        // Send the list of books as a response
        res.status(200).json(books);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching books:', error.message);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from request parameters

    try {
        // Make an HTTP GET request to fetch book details based on ISBN
        const response = await axios.get('https://droverzz2546-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books');

        // Extract the book details from the response
        const bookDetails = response.data;

        // If book found, return the book details
        const book = bookDetails[isbn];
        res.status(200).json({ book: book });
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching book details:', error.message);
        res.status(500).json({ error: 'Failed to fetch book details' });
    }
});


  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author; // Retrieve the author from request parameters
    try {
        // Make an HTTP GET request to fetch book details based on ISBN
        const response = await axios.get('https://droverzz2546-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books');

        // Extract the book details from the response
        const bookDetails = response.data;

        // If book found, return the book details
        const matchingBooks = [];
    for (const isbn in bookDetails) {
        if (books.hasOwnProperty(isbn)) {
            const book = bookDetails[isbn];
            if (book.author === author) {
                matchingBooks.push({ isbn: isbn, book: book });
            }
        }
    }

    // If books found for the author, return the list of matching books
    res.status(200).json({ books: matchingBooks });
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching book details:', error.message);
        res.status(500).json({ error: 'Failed to fetch book details' });
    }
    
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const response = await axios.get('https://droverzz2546-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books');

        // Extract the books data from the response
        const books = response.data;
        const title = req.params.title; // Retrieve the title from request parameters

        const matchingBooks = [];
        for (const isbn in books) {
            if (books.hasOwnProperty(isbn)) {
                const book = books[isbn];
                if (book.title.toLowerCase().includes(title.toLowerCase())) {
                    matchingBooks.push({ isbn: isbn, book: book });
                }
            }
        }
        // If books found for the title, return the list of matching books
        res.status(200).json({ books: matchingBooks });
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching books:', error.message);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});


// Get book review based on ISBN
public_users.get('/review/:isbn', function(req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from request parameters

    // Check if the book with the given ISBN exists in the books object
    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Retrieve the reviews for the book with the specified ISBN
    const book = books[isbn];
    const bookReviews = book.reviews;

    // If reviews are found, return the reviews
    return res.status(200).json({ reviews: bookReviews });
});



module.exports.general = public_users;
