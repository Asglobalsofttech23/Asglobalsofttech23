const accountSid = 'ACbe49d10293c6734f828c9dc9f86f897b';
const authToken = '3a388c20b1559ef6ed72f3973dd6c00e';
const client = require('twilio')(accountSid, authToken);

// Function to make a voice call
async function makeVoiceCall(to, from, message) {
  try {
    const call = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml', // TwiML URL for voice instructions
      to: to,
      from: from,
    });

    console.log(`Voice call initiated with SID: ${call.sid}`);
  } catch (error) {
    console.error(`Error making voice call: ${error.message}`);
  }
}

// Example usage
const toPhoneNumber = '+918667326535'; // Replace with the recipient's phone number
const fromPhoneNumber = '+12029331139'; // Replace with your Twilio phone number
const voiceMessage = 'Hello, this is a Twilio voice call!';

makeVoiceCall(toPhoneNumber, fromPhoneNumber, voiceMessage);
