const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

let items = [];
let id = 1;

// CREATE
app.post('/api/items', (req, res) => {
  const newItem = { id: id++, ...req.body };
  items.push(newItem);
  res.json(newItem);
});

// READ
app.get('/api/items', (req, res) => {
  res.json(items);
});

// UPDATE
app.put('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const index = items.findIndex((item) => item.id === itemId);
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body };
    res.json(items[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// DELETE
app.delete('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  items = items.filter((item) => item.id !== itemId);
  res.json({ message: 'Item deleted' });
});

// 🔁 Add this for testing resets
app.post('/api/reset', (req, res) => {
  items = [];
  id = 1;
  res.json({ message: 'Reset successful' });
});

module.exports = app;
