const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure CORS with specific options
const corsOptions = {
    origin:  ['https://www.thermalvisionecology.co.uk', "localhost:3000"], // Ensure this matches the exact URL of your frontend
    methods: 'POST', // You can also use ['GET', 'POST'] if you handle multiple types of requests
    allowedHeaders: ['Content-Type', 'Authorization', "Access-Control-Allow-Origin"],
    credentials: true, // If your frontend needs to send cookies or authorization headers
  };
  
//   app.use(cors(corsOptions));
app.use(cors());
  


const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;


// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    // user: process.env.EMAIL,
    user: "jethro@thermalvisionresearch.co.uk",
    // pass: process.env.PASSWORD, 
    pass: "ThermalVR2k4"
  },
});

// Route to handle form submission
app.post('/send-email', (req, res) => {
  const { fullName, email, dates, cameras, project, phoneNumber } = req.body;

  // Email content
  const mailOptions = {
    from: email, // Sender address
    to: 'jethro@thermalvisionresearch.co.uk', // Receiver address
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
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
