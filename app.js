// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { Book, initializeDatabase } = require('./models');

const app = express();
const port = process.env.PORT || 3000;

// Use JSON body parsing middleware
app.use(bodyParser.json());

// --- Basic Authentication Middleware ---
// For this example, we use a simple basic authentication
// All requests must include an Authorization header with "Basic base64(admin:secret)"
const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Access to the API"');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Decode the credentials from Base64
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Check the username and password (hardcoded for this demo)
  if (username === 'admin' && password === 'secret') {
    return next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Access to the API"');
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Apply the basicAuth middleware to all API routes
app.use('/api', basicAuth);

// --- API Endpoints ---

/**
 * 1. Add a New Book
 * Endpoint: POST /api/books
 */
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, publishedDate, numberOfPages } = req.body;
    if (!title || !author || !publishedDate || !numberOfPages) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newBook = await Book.create({ title, author, publishedDate, numberOfPages });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. Retrieve a List of All Books
 * Endpoint: GET /api/books
 */
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 3. Get Details of a Specific Book
 * Endpoint: GET /api/books/:id
 */
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 4. Update a Book's Details
 * Endpoint: PUT /api/books/:id
 */
app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, publishedDate, numberOfPages } = req.body;
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    // Only update the fields provided in the request
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (publishedDate !== undefined) book.publishedDate = publishedDate;
    if (numberOfPages !== undefined) book.numberOfPages = numberOfPages;
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 5. Delete a Book
 * Endpoint: DELETE /api/books/:id
 */
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Start the Server ---
// Initialize the database before starting the server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
