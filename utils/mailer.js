const nodemailer = require("nodemailer");

const sendVerificationEmail = async (toEmail, verificationUrl) => {
  const gmailUser = process.env.EMAIL_USER;
  const gmailPassword = process.env.EMAIL_PASS;

  const subject = "Verify Your Email";
  const body = `Click <a href="${verificationUrl}">here</a> to verify your email.`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendVerificationEmail;
