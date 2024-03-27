// twilioVoiceServer.js

const express = require('express');
const { VoiceResponse } = require('twilio').twiml;
const app = express();

// Handle incoming calls
app.post('/voice', (req, res) => {
  const twiml = new VoiceResponse();
  twiml.gather({
    input: 'speech dtmf', // Listen for speech and DTMF tones
    timeout: 5, // Set a timeout for user input
    action: '/handle-user-input', // Handle user input on this endpoint
    method: 'POST',
  }).say('Speak something or press a key.');

  res.type('text/xml');
  res.send(twiml.toString());
});

// Handle user input
app.post('/handle-user-input', (req, res) => {
  const twiml = new VoiceResponse();
  
  // Retrieve user input
  const userInput = req.body.SpeechResult || req.body.Digits;

  // Do something with user input (e.g., send it to your web application)

  // Respond to user input
  twiml.say(`You said: ${userInput}`);

  res.type('text/xml');
  res.send(twiml.toString());
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
