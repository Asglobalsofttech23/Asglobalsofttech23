// const accountSid = 'ACbe49d10293c6734f828c9dc9f86f897b';
// const authToken = '3a388c20b1559ef6ed72f3973dd6c00e';
// const client = require('twilio')(accountSid, authToken);

// // Function to initiate a call

// // Function to initiate a call
// async function makeVoiceCall(to, from) {
//     try {
//       const call = await client.calls.create({
//         url: 'https://randomstring.ngrok.io/voice', // Update with your public URL
//         to: to,
//         from: from,
//       });
  
//       console.log(`Voice call initiated with SID: ${call.sid}`);
//     } catch (error) {
//       console.error(`Error making voice call: ${error.message}`);
//     }
//   }
  

// // Example usage
// const toPhoneNumber = '+918667326535'; // Replace with the recipient's identity
// const fromPhoneNumber = '+12029331139'; // Replace with the caller's identity

// makeVoiceCall(toPhoneNumber, fromPhoneNumber);







const accountSid = 'ACbe49d10293c6734f828c9dc9f86f897b';
const authToken = '3a388c20b1559ef6ed72f3973dd6c00e';
const client = require('twilio')(accountSid, authToken);

// Function to initiate a call
async function makeVoiceCall(to, from) {
    try {
        const call = await client.calls.create({
            url: 'https://randomstring.ngrok.io/voice', // Update with your public URL
            to: to,
            from: from,
            twiml: `<Response><Say>Hello! This is a test voice call. Thank you for using Twilio.</Say></Response>`,
        });

        console.log(`Voice call initiated with SID: ${call.sid}`);
    } catch (error) {
        console.error(`Error making voice call: ${error.message}`);
    }
}

// Example usage
const toPhoneNumber = '+918667326535'; // Replace with the recipient's identity
const fromPhoneNumber = '+12029331139'; // Replace with the caller's identity

makeVoiceCall(toPhoneNumber, fromPhoneNumber);
     