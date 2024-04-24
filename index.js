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
app.use(cors({
  origin: ['https://www.thermalvisionecology.co.uk', "https://www.thermalvisionecology.co.uk/api", "http://localhost:3000", "thermalvisionecology.co.uk", "ecology-jmm8ns2nq-jayteebees-projects.vercel.app"], // Replace with your frontend URL
  methods: ['POST'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));


const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;


// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    // user: process.env.EMAIL,
    user: EMAIL,
    // pass: process.env.PASSWORD, 
    pass: PASSWORD
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
