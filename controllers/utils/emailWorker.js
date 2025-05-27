

process.on('message', async ({ type, user, token }) => {
    const mail = require('../../mail');
    if (type === 'verification') {
      await  mail.sendVerificationEmail(user, token);
    } else if (type === 'reset') {
       await mail.sendResetPasswordEmail(user, token);
    }
    process.exit(); // simulate process termination
});
