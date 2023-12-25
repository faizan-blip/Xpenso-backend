const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const mailsender = async (totalExpense, overallBudget, authEmail) => {
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

    const imagePath = path.join(__dirname, 'reminder.png'); // Update the path accordingly

    let info = await transporter.sendMail({
      from: 'Xpenso',
      to: authEmail,
      subject: '🚨 Expense Limit Exceeded! 🚨',
      html: `
        <img src="cid:reminderImage" alt="Emoji Image" style="height: 200px; width: 100%">
        <p>Your expense of the month has exceeded the budget. Please slow down!</p>
        <p>Details:</p>
        <ul>
          <li><strong>Budget:${overallBudget}</strong></li>
          <li><strong>Expense Amount:${totalExpense}</strong></li>
        </ul>
        <p>Thank you for using Xpenso!</p>
      `,
      attachments: [
        {
          filename: 'reminder.png',
          path: imagePath,
          cid: 'reminderImage', // Set the Content-ID (cid) to reference in the email
        },
      ],
    });

    console.log(info);
    res.json(info);
  } catch (err) {
    console.log(err);
  }
};

module.exports = mailsender;
