const nodemailer = require('nodemailer')

exports.sendEmail = async(subject,to,body) =>{
    const EMAIL = process.env.EMAIl
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:`${EMAIL}`,
            pass:`${EMAIL_PASSWORD}`
        }
    })

    const mailOptions = {
        from: `${EMAIL}`,
        to:to,
        subject:subject,
        text:body
    }

    transporter.sendMail(mailOptions,(err,info)=>{
        if(err) throw new Error("Error sending mail")
    })
}
