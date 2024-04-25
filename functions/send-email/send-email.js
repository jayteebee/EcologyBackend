// // Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
// const handler = async (event) => {
//   try {
//     const subject = event.queryStringParameters.name || 'World'
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: `Hello ${subject}` }),
//       // // more keys you can return:
//       // headers: { "headerName": "headerValue", ... },
//       // isBase64Encoded: true,
//     }
//   } catch (error) {
//     return { statusCode: 500, body: error.toString() }
//   }
// }

// module.exports = { handler }


// Import dependencies
const nodemailer = require('nodemailer');
const { parse } = require('querystring');

// Configure nodemailer transport using environment variables
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL || "jethro@thermalvisionresearch.co.uk",
    pass: process.env.PASSWORD || "ThermalVR2k4",
  },
});

// Netlify function handler
exports.handler = async (event) => {
  // Only allow POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
      headers: { 'Allow': 'POST' },
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { fullName, email, dates, cameras, project, phoneNumber } = data;

    // Mail options
    const mailOptions = {
      from: email,
      to: 'jethro@thermalvisionresearch.co.uk',
      subject: 'Ecology Kit Enquiry',
      text: `
        Full Name: ${fullName}
        Email: ${email}
        Phone Number: ${phoneNumber}
        Dates Needed: ${dates}
        Cameras Needed: ${cameras}
        Project Details: ${project}
      `,
    };

    // Send email
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    // Catch any errors and return a 500 error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
