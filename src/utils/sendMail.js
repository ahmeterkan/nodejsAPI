const nodemailer = require("nodemailer")

const sendEmail = async (mailOptions) => {
    const transposter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    transposter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Hata çıktı mail gönderilemedi :", error)
        }
        console.log(info)
       
        return true
    })
}
module.exports = sendEmail