const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendAppointmentConfirmationEmail = async ({ patientEmail, patientName, doctorName, date, time, fee }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const mailOptions = {
    from: `"Clinic App" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: "Appointment Confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2e7d32;">Appointment Confirmed</h2>
        <p>Hello <strong>${patientName}</strong>,</p>
        <p>Great news! Your appointment has been confirmed.</p>
        <h3 style="color: #1565c0;">Appointment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%;">Doctor:</td>
            <td style="padding: 8px;">${doctorName}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px; font-weight: bold;">Date:</td>
            <td style="padding: 8px;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Time:</td>
            <td style="padding: 8px;">${time}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px; font-weight: bold;">Appointment Fee:</td>
            <td style="padding: 8px;">Rs. ${fee}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #757575; font-size: 13px;">Please arrive 10 minutes before your scheduled time. If you need to cancel or reschedule, please contact us in advance.</p>
        <p style="color: #757575; font-size: 13px;">Thank you for choosing our clinic.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendAppointmentConfirmationEmail };
