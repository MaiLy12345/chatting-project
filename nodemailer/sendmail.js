"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config();

// async..await is not allowed in global scope, must use a wrapper
async function main(gmail, randomCode){
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "mailypd02033@gmail.com", // generated ethereal user
      pass: "hoilamgi" // generated ethereal password
    }
  });
    
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"maily" <maily@gmail.com>', // sender address
    to: gmail, // list of receivers
    subject: "Hello ", // Subject line
    text: "Hello", // plain text body
    html: `<p>Your Code:  ${randomCode} </p>`
  });
  
  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
  return info;
}
module.exports = main;
