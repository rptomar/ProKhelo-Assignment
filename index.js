// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./userRoutes');

const app = express();

// Connect to MongoDB using environment variables
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error.message);
});

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use(userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});



// Start the server on port 8000 using environment variables
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
