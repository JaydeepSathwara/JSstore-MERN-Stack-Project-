const nodeMailer = require('nodemailer');

const sendEmail = async(options) => {
    
    const transport = nodeMailer.createTransport({
        service:process.env.SMPT_SERVICE,
        auth:{
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    })

    const MailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transport.sendMail(MailOptions);
}

module.exports = sendEmail;