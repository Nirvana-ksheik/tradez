import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const getTransporter = () => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_PASSWORD
        },
        host: 'smtp.gmail.com',
        port: 587,
        requireTLS: true,
        secure: true
    });

    return transporter;
}


const sendConfirmationEmail = async ({email, token}) => {

    console.log("reached sending confirmation email helper");
    const url = `http://localhost:3000/api/auth/confirm/${token}`;

    const transporter = getTransporter();

    const info = await transporter.sendMail({
        to: email,
        subject: 'Confirm Email',
        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
    });

    console.log("finished sending email");
    console.log("info: ", info);    
}

const sendResetPasswordEmail = async ({email, token}) => {

    console.log("reached sending reset password email helper");

    const url = `http://localhost:3000/api/auth/reset/${token}`;

    const transporter = getTransporter();

    const info = await transporter.sendMail({
        to: email,
        subject: 'Reset Password Email',
        html: `Please click this link to proceed to reset your password: <a href="${url}">${url}</a>`
    });

    console.log("finished sending email");
    console.log("info: ", info);    
}

export {sendConfirmationEmail, sendResetPasswordEmail};