const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Common email sender
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await transporter.sendMail({
      from: `"BaggageApp" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text
    });

    return true;
  } catch (error) {
    console.error('Email Error:', error.message);
    return false;
  }
};

module.exports = sendEmail;
