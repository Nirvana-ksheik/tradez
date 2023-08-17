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


const sendConfirmationEmail = async ({email, token, password, isCharity = false}) => {

    console.log("reached sending confirmation email helper");

    const frontEndUrl = isCharity ? 
                        `http://localhost:3001/charity/confirm-email/${token}` : 
                        `http://localhost:3001/confirm-email/${token}`;

    const transporter = getTransporter();

    const info = await transporter.sendMail({
        to: email,
        subject: 'Confirm Email',
        html: isCharity ? 
            `NOTE: Your application is being processed by an expert user <br><br/>
             To continue the process Please click this link to confirm your email: <a href="${frontEndUrl}">Click Here</a><br></br>
             Please use this password to login to the portal: ${password} <br><br/>
             You can change it anytime after you confirm your email address. 
             
            <br><br/><br><br/>

             <br><br/> .ملاحظة: تتم معالجة طلبك من قبل مستخدم خبير
             <br></br><a href="${frontEndUrl}">اضغط هنا</a> لمتابعة العملية، يُرجى النقر على هذا الرابط لتأكيد عنوان بريدك الإلكتروني 
             <br><br/> <h4>${password}</h4> يرجى استخدام هذه كلمة المرور لتسجيل الدخول إلى البوابة 
            .يمكنك تغييرها في أي وقت بعد تأكيد عنوان بريدك الإلكتروني
             ` 
             :

             `Please click this link to confirm your email: <a href="${frontEndUrl}">Click Here</a>
             <br><br/>
             يرجى الضغط على هذا الرابط لتأكيد بريدك الإلكتروني :<a href="${frontEndUrl}">اضغط هنا</a>`

    });

    console.log("finished sending email");
    console.log("info: ", info);    
}

const sendResetPasswordEmail = async ({email, token}) => {

    console.log("reached sending reset password email helper");

    const frontendUrl = `http://localhost:3001/auth/reset/${token}`;

    const transporter = getTransporter();

    const info = await transporter.sendMail({
        to: email,
        subject: 'Reset Password Email',
        html: `Please click this link to proceed to reset your password: <a href="${frontendUrl}">Click Here!</a>`
    });

    console.log("finished sending email");
    console.log("info: ", info);    
}

export {sendConfirmationEmail, sendResetPasswordEmail};