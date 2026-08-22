const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Workforce Analytics <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
};

// Performance submission notification
const sendPerformanceSubmissionEmail = async (employee, kpi) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4472C4;">Performance Submission Notification</h2>
      <p>Dear ${employee.name},</p>
      <p>Your performance submission for <strong>${kpi.title}</strong> has been received successfully.</p>
      <p>Your submission is now pending review by your supervisor.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        This is an automated email from Digital Workforce Performance Analytics Platform.
      </p>
    </div>
  `;

  return sendEmail({
    email: employee.email,
    subject: 'Performance Submission Confirmation',
    html
  });
};

// Performance approval notification
const sendPerformanceApprovalEmail = async (employee, kpi, status) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4472C4;">Performance ${status === 'approved' ? 'Approved' : 'Rejected'}</h2>
      <p>Dear ${employee.name},</p>
      <p>Your performance submission for <strong>${kpi.title}</strong> has been ${status}.</p>
      ${status === 'rejected' ? '<p>Please check the supervisor remarks and resubmit if required.</p>' : ''}
      <hr>
      <p style="color: #666; font-size: 12px;">
        This is an automated email from Digital Workforce Performance Analytics Platform.
      </p>
    </div>
  `;

  return sendEmail({
    email: employee.email,
    subject: `Performance ${status === 'approved' ? 'Approved' : 'Rejected'}`,
    html
  });
};

module.exports = {
  sendEmail,
  sendPerformanceSubmissionEmail,
  sendPerformanceApprovalEmail
};