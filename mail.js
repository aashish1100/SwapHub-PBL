const nodemailer = require('nodemailer');

// Environment variables (load from .env file or directly)
const emailUser = process.env.EMAIL_USER ;
const emailPass = process.env.EMAIL_PASS ;
const baseUrl = process.env.BASE_URL;
// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
 user: emailUser,
 pass: emailPass
}
});

// Send an email
const send = async (to, subject, text) => {
try {
 await transporter.sendMail({
   from: emailUser, // Sender's email address
   to: to,          // Recipient's email address
   subject: subject,
   html: text
 });
 console.log('Email sent successfully');
} catch (error) {
 console.error('Error sending email:', error);
 throw error;
}
};



let sendRentText = (listing, formData) => {
  const subject = 'New Booking Request on SwapHub';
  const emailBody = `
      <p>Hello ${listing.owner.username},</p>
      
      <p>You have received a new booking request on SwapHub:</p>
      
      <p><strong>Product:</strong> ${listing.title}<br>
      <strong>Renter's Name:</strong> ${formData.name}<br>
      <strong>Renter's WhatsApp Number:</strong> ${formData.number}<br>
      <strong>Booking Period:</strong> ${formData.fromDate} to ${formData.toDate}</p>
      
      <p><strong>Message from the Renter:</strong></p>
      <p>${formData.message}</p>
      
      <p>Please review the details and confirm the booking at your earliest convenience.</p>
      
      <p>Thank you for using SwapHub!</p>
      
      <p>Best regards,<br>
      The SwapHub Team</p>
  `;

  // Assuming you have a function called 'send' to send emails.
  send(listing.owner.email, subject, emailBody);
  console.log(emailBody);
};



let sendBuyText = (listing ,formData) => {
  const subject = 'New Purchase Request on SwapHub';
  const emailBody = `
      <p>Hello ${listing.owner.username},</p>
      
      <p>You have received a new purchase request on SwapHub:</p>
      
      <p><strong>Product:</strong> ${listing.title}<br>
      <strong>Buyer's Name:</strong> ${formData.name}<br>
      <strong>Buyer's WhatsApp Number:</strong> ${formData.number}</p>
      
      <p><strong>Message from the Buyer:</strong></p>
      <p>${formData.message}</p>
      
      <p>Please review the details and confirm the purchase at your earliest convenience.</p>
      
      <p>Thank you for using SwapHub!</p>
      
      <p>Best regards,<br>
      The SwapHub Team</p>
  `;

  // Assuming you have a function called 'send' to send emails.
  send(listing.owner.email, subject, emailBody);
  // console.log(emailBody);
};

let sendVerificationEmail = (newUser,verificationToken)=>
{
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
    
   const subject='Verify your email for SwapHub'
   const emailBody = `
   <p>Hello ${newUser.username},</p>
   
   <p>Thank you for signing up with SwapHub! Please verify your email address by clicking the link below:</p>
   
   <p><a href="${verificationUrl}">Verify Email</a></p>
   
   <p>If you did not sign up for this account, please disregard this email.</p>
   
   <p>Best regards,<br>
   The SwapHub Team</p>
 `;
//  console.log(verificationUrl);
  send(newUser.email,subject,emailBody);
}

const sendResetPasswordEmail = (user, resetToken) => {
  // Construct the reset URL
  const resetUrl = `${baseUrl}/reset?token=${resetToken}`;

  // Define the email subject and body
  const subject = 'Password Reset Request for SwapHub';
  const emailBody = `
  <p>Hello ${user.username},</p>
  
  <p>We received a request to reset your password. Please click the link below to set a new password:</p>
  
  <p><a href="${resetUrl}">Reset Password</a></p>
  
  <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
  
  <p>Best regards,<br>
  The SwapHub Team</p>
  `;

  // Call the send function to actually send the email
  send(user.email, subject, emailBody);
};

module.exports ={
    sendRentText,
    sendBuyText,
    sendVerificationEmail,
    sendResetPasswordEmail
}
