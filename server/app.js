const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// --- MongoDB connection ---
const mongoURI = process.env.MONGODB_URI; 
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/contacts', require('./routes/contactRoutes'));

module.exports = app;
