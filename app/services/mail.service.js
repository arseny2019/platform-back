const nodemailer = require('nodemailer');
require('dotenv').config();

class MailService {

    constructor() {
        console.log('user:', process.env.SMTP_USER);
        console.log('password:', process.env.GOOGLE_EMAIL_APP_PASSWORD);
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.GOOGLE_EMAIL_APP_PASSWORD
            }
        });
    }

    async sendConfirmationEmail(email, activationCode) {
        return this.transporter.sendMail(
            {
                from: process.env.SMTP_USER,
                to: email,
                subject: "Please confirm your account",
                html: `<h1>Email Confirmation</h1>
                <h2>Здравствуйте!</h2>
                <p>Благодарим за регистрацию, для завершения процедуры перейдите по ссылке в сообщении.</p>
                <a href="${process.env.HOST}/auth/confirm/${activationCode}">Завершить регистрацию</a>
                </div>`,
            }
        );
    }
}

module.exports = new MailService();
