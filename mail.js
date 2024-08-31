const nodemailer = require('nodemailer');

// Environment variables (load from .env file or directly)
const emailUser = process.env.EMAIL_USER ;
const emailPass = process.env.EMAIL_PASS ;

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
   text: text
 });
 console.log('Email sent successfully');
} catch (error) {
 console.error('Error sending email:', error);
 throw error;
}
};


let getRentText = (ownername,productName,rentersName,WhatsappNumber,startDate,endDate,msg)=>
{
    const emailBody = `
Hello ${ownername},

You have received a new booking request on SwapHub.

Product: ${productName}
Renter's Name: ${rentersName}
Renter's Whatsapp no.: ${WhatsappNumber}
Booking Period: ${startDate} to ${endDate}

Message from the Renter:
${msg}

Please review the details and confirm the booking at your earliest convenience.

Thank you for using SwapHub!

Best regards,
The SwapHub Team
`;
return emailBody;
}

let getBuyText=(ownername,productName,buyersName,WhatsappNumber,msg)=>
{
    const emailBody=`Hello ${ownername},

You have received a new purchase request on SwapHub.

Product: ${productName}
Buyer's Name: ${buyersName}
Buyer's Whatsapp no.: ${WhatsappNumber}

Message from the Buyer:
${msg}

Please review the details and confirm the purchase at your earliest convenience.

Thank you for using SwapHub!

Best regards,
The SwapHub Team`

return emailBody;
}

let welcome = (username)=>
{
    let emailBody = `
Hello ${username},

Welcome to SwapHub!

Thank you for signing up. We're excited to have you join our community where students can easily rent, buy, and exchange items with one another.

Do you have items you no longer use, use less frequently, or want to earn from? Start listing them on SwapHub! Whether it's used books, electronic devices, or anything else, you can share them with others while making some extra money.

Get started by adding your products to the platform and see how easy it is to connect with fellow students.

If you have any questions or need assistance, feel free to reach out to us at 8534095668.

Happy swapping and earning!

Best regards,
The SwapHub Team
`;
    

return emailBody;
}

module.exports ={
    send,
    getRentText,
    getBuyText,
    welcome,
}
