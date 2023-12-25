const nodemailer = require('nodemailer');
require('dotenv').config();

const forgotlink = async (link , authEmail) => {
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
        from: 'Xpenso',
        to: authEmail,
        subject: '🔐 Password Reset Request 🔐',
        html: `
          <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
          <p>To reset your password, click the link below:</p>
          <a href="${link}">Reset Password</a>
          <p>If the link doesn't work, copy and paste the following URL into your browser:</p>
          <p>${link}</p>
          <p>Thank you for using Xpenso!</p>
        `,
      });

    console.log(info);
    res.json(info);
  } catch (err) {
    console.log(err);
  }
};

module.exports = forgotlink;
