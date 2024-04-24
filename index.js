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

//Configure CORS with specific options
// const corsOptions = {
//     origin: 'https://www.thermalvisionecology.co.uk', // Include other necessary domains
//     methods: ['POST', 'OPTIONS'],  // Include OPTIONS to handle preflight
//     allowedHeaders: ['Content-Type', 'Authorization', "Access-Control-Allow-Origin"],
//     credentials: true,
// };

// app.use(cors(corsOptions));

app.use(cors(
    {
        origin: "*" //['http://localhost:3000']
    }
));
  


const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;


app.post('/send-email', (req, res) => {
    const { fullName, email, dates, cameras, project, phoneNumber } = req.body;
  
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
  
    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL || "jethro@thermalvisionresearch.co.uk",
        pass: process.env.PASSWORD || "ThermalVR2k4"
      },
    });
  
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
