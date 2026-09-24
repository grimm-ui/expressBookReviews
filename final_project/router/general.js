const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!users.some(user => user.username === username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "Customer successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
  
    getBooks.then((bks) => {
      return res.status(200).send(JSON.stringify(bks, null, 4));
    }).catch((err) => {
      return res.status(500).json({ message: "Error fetching books" });
    });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const getBook = new Promise((resolve, reject) => {
      const isbn = req.params.isbn;
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject({ status: 404, message: "Book not found" });
      }
    });
  
    getBook.then((book) => {
      return res.status(200).send(book);
    }).catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const author = req.params.author;
      const bookKeys = Object.keys(books);
      const filteredBooks = [];
  
      bookKeys.forEach((key) => {
        if (books[key].author === author) {
          filteredBooks.push(books[key]);
        }
      });
  
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject({ status: 404, message: "Author not found" });
      }
    });
  
    getBooksByAuthor.then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    }).catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const getBooksByTitle = new Promise((resolve, reject) => {
      const title = req.params.title;
      const bookKeys = Object.keys(books);
      const filteredBooks = [];
  
      bookKeys.forEach((key) => {
        if (books[key].title === title) {
          filteredBooks.push(books[key]);
        }
      });
  
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject({ status: 404, message: "Title not found" });
      }
    });
  
    getBooksByTitle.then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    }).catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
  });

module.exports.general = public_users;
