const nodemailer = require('nodemailer');

// Email configuration (optional - for future notifications)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER) {
      console.log('📧 Email service not configured - Skipping email');
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: `Digital Workforce Analytics <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, message: error.message };
  }
};

const sendPerformanceApprovalEmail = async (employee, kpi, status, remarks) => {
  const statusColor = status === 'approved' ? '#059669' : '#dc2626';
  const statusText = status === 'approved' ? 'Approved ✅' : 'Rejected ❌';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center; color: white; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 8px; margin-top: 20px; }
        .status { font-size: 24px; font-weight: bold; color: ${statusColor}; text-align: center; margin: 20px 0; }
        .details { background: white; padding: 20px; border-radius: 6px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Performance Submission Update</h1>
          <p>Digital Workforce Analytics Platform</p>
        </div>
        <div class="content">
          <p>Dear ${employee.name},</p>
          <p>Your performance submission has been reviewed.</p>
          
          <div class="status">${statusText}</div>
          
          <div class="details">
            <p><strong>KPI:</strong> ${kpi.title}</p>
            <p><strong>Status:</strong> ${status.toUpperCase()}</p>
            ${remarks ? `<p><strong>Supervisor Remarks:</strong> ${remarks}</p>` : ''}
          </div>
          
          <p>You can view detailed performance report by logging into the system.</p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/performance-reports" 
               style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Performance Reports
            </a>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email from Digital Workforce Analytics Platform</p>
          <p>© ${new Date().getFullYear()} Government of India</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: employee.email,
    subject: `Performance Submission ${status === 'approved' ? 'Approved' : 'Rejected'} - ${kpi.title}`,
    html,
  });
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center; color: white; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 8px; margin-top: 20px; }
        .credentials { background: white; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #1e40af; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Digital Workforce Analytics</h1>
          <p>Government Performance Management Platform</p>
        </div>
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>Welcome to the Digital Workforce Performance Analytics Platform!</p>
          
          <div class="credentials">
            <p><strong>Your Account Details:</strong></p>
            <p>Employee ID: <strong>${user.employeeId}</strong></p>
            <p>Department: <strong>${user.department.name}</strong></p>
            <p>Designation: <strong>${user.designation}</strong></p>
            <p>Role: <strong>${user.role.toUpperCase()}</strong></p>
          </div>
          
          <p>You can now login to the system using your email and password.</p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/login" 
               style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Login to Dashboard
            </a>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email from Digital Workforce Analytics Platform</p>
          <p>© ${new Date().getFullYear()} Government of India</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Welcome to Digital Workforce Analytics Platform',
    html,
  });
};

module.exports = {
  sendEmail,
  sendPerformanceApprovalEmail,
  sendWelcomeEmail,
};
