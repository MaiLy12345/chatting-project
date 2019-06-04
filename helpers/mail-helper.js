const nodemailer =  require('nodemailer'); 
require('dotenv').config()
const sendMail = (toEmail, code) => {
    const transporter =  nodemailer.createTransport({ 
        service: 'Gmail',
        auth: {
            user: 'mailypd02033@gmail.com',
            pass: 'hoilamgi'
        }
    });
    const mainOptions = { 
        from: 'Mai Ly',
        to: toEmail,
        subject: 'Change pass',
        text: 'You code:  ',
        html: '<p>' + code + '</p>'
    }
    return transporter.sendMail(mainOptions);
}
module.exports = sendMail;