import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.APP_USER,
        pass:process.env.APP_PASSWORD
    }
})

export const sendHtmlMail = async(to:string ,subject:string,html:string)=>{
    await transporter.sendMail({
        to,
        subject,
        from:process.env.APP_USER,
        html
    })
}