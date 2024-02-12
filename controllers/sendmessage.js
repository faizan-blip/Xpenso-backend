const nodemailer = require('nodemailer');
require('dotenv').config();

const sendmessage = async (name ,email , message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
        from: "no-reply",
        to: process.env.MAIL_USER,
        subject: '📧 Contact Us Request 📧',
      html: `
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message:${message}</p>
        <p>Thank you for using our service!</p>
      `,
    });

    console.log(info);
    res.json(info);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendmessage;
