const express = require('express');
const router = express.Router();

// POST route to receive response from Mux webhook
router.post('/', (req, res) => {
  // Handle the incoming request data
  const eventData = req.body;

  // Process the event data as needed
  console.log('Received event from Mux:', eventData);

  // Send a response back to Mux
  res.status(200).send('Received event from Mux');
});

module.exports = router;