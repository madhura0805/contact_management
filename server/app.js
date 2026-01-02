const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/contacts', require('./routes/contactRoutes'));

module.exports = app;
