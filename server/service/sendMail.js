const nodemailer = require('nodemailer');

// Hàm gửi email
const sendEmail = async (to, subject, text) => {
  try {
    // Khởi tạo transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Thay bằng dịch vụ email của bạn
      auth: {
        user: 'tranthethanh852002@gmail.com', // Email người gửi
        pass: 'zixnfqdunguxwdvc', // Mật khẩu email người gửi

      },
    });

    const mailOptions = {
      from: 'tranthethanh852002@gmail.com', 
      to, 
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
module.exports = sendEmail;