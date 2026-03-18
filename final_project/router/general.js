const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    res.send(JSON.stringify(books[isbn],null,4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author){
      booksbyauthor.push({"isbn":isbn, ...books[isbn]});
    }
  });
  if(booksbyauthor.length > 0){
    res.send(JSON.stringify(booksbyauthor,null,4));
  } else {
    return res.status(404).json({message: "Author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let booksbytitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title){
      booksbytitle.push({"isbn":isbn, ...books[isbn]});
    }
  });
  if(booksbytitle.length > 0){
    res.send(JSON.stringify(booksbytitle,null,4));
  } else {
    return res.status(404).json({message: "Title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    let reviews = books[isbn]["reviews"];
    if(Object.keys(reviews).length > 0){
      res.send(JSON.stringify(reviews,null,4));
    } else {
      return res.status(404).json({message: "No reviews found for this book"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 11 - Get book details based on ISBN using async/await with Axios
public_users.get('/async-isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5001/isbn/${req.params.isbn}`);
    return res.status(200).send(JSON.stringify(response.data,null,4));
  } catch(error) {
    return res.status(500).json({message: "Error fetching book details"});
  }
});

// Task 12 - Get book details based on author using async/await with Axios
public_users.get('/async-author/:author', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5001/author/${req.params.author}`);
    return res.status(200).send(JSON.stringify(response.data,null,4));
  } catch(error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});

// Task 13 - Get book details based on title using async/await with Axios
public_users.get('/async-title/:title', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5001/title/${req.params.title}`);
    return res.status(200).send(JSON.stringify(response.data,null,4));
  } catch(error) {
    return res.status(500).json({message: "Error fetching books by title"});
  }
});

// Task 10 - Get all books using async/await with Axios
public_users.get('/async-books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5001/');
    return res.status(200).send(JSON.stringify(response.data,null,4));
  } catch(error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

module.exports.general = public_users;
