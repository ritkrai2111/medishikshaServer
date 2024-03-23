const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Load environment variables from .env file
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// Mux API endpoint for uploading
const baseUrl = 'https://api.mux.com';
const options = {  
  headers: {
    'User-Agent': `Mux Direct Upload Button`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  auth: {
    username: process.env.MUX_ACCESS_TOKEN_ID,
    password: process.env.MUX_SECRET_KEY,
  },
  mode: 'cors',
};

// Route for uploading
app.post('/upload', async (req, res) => {
  try {
    const response = await axios.post(`${baseUrl}/video/v1/uploads`, { 
      "cors_origin": "*",
      "new_asset_settings": {
        "playback_policy": ["public"]
      }
    }, options);
    return res.send(response.data && response.data.data);
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).send("Error uploading video");
  }
});

// Route for checking server status
app.get('/check', (req, res) => {
  res.send("Server is up and running!");
});

// Route for handling course-related operations
app.use('/courses', courseRoutes);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`👂🏻 Example app listening on port ${port}`);
});
