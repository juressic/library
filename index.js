const dotenv = require('dotenv/config');
const mongoose = require('mongoose');
const express = require('express');
const AuthorSchema = require('./models/Author.js');
const BookSchema = require('./models/Book.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = 5558;
const app = express();

mongoose.connect(process.env.DB_LINK);

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
  });
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'build')));

app.post('/author', async (req, res) => {
  if (!req.body?.name || !req.body?.id)
    return res.status(400).json({ error: 'Author not found' });

  try {
    const authors = AuthorSchema({
      id: req.body.id,
      name: req.body.name,
    });
    const result = await authors.save();
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
  }
});

app.delete('/book', async (req, res) => {
  if (!req?.body?.name)
    return res.status(400).json({
      error: 'Bad request',
    });

  try {
    const result = await BookSchema.findOneAndDelete({ name: req.body.name });
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(404).json({
      error: 'Book not found',
    });
  }
});

app.post('/book', async (req, res) => {
  if (!req?.body?.name || !req?.body?.authorId || !req?.body?.id) {
    console.log(req.body);
    return res.status(400).json({
      error: 'Bad request, some parameters are missing in the request body',
    });
  }

  try {
    const newBook = BookSchema({
      name: req.body.name,
      authorId: req.body.authorId,
      id: req.body.id,
    });
    const result = await newBook.save();
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
  }
});

app.get('/authors', async (req, res) => {
  try {
    const authors = await AuthorSchema.find();
    res.status(200).json({ authors });
  } catch (err) {
    console.log(err);
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await BookSchema.find();
    res.status(200).json({ books });
  } catch (err) {
    console.log(err);
  }
});

app.use('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
);
