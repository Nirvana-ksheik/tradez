import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import pkg from 'bcryptjs';
const { compare } = pkg;
import model from '../models/User.js';
import {sendConfirmationEmail, sendResetPasswordEmail} from '../helpers/emailHelper.js';
dotenv.config();

const createToken = ({user, secret, expirydate}) =>{
    console.log("reached createToken");
    if(expirydate)
    {
        const token =  jwt.sign({...user}, secret, {
            expiresIn: expirydate
        });
        return token;
    }
    const token = jwt.sign({...user}, secret);
    return token;
}

const login = async ({username, password}) => {

    const userbyname = await model.findOne({ username: username });
    const userbyemail = await model.findOne({ email: username });
    const user = userbyname ? userbyname : userbyemail ? userbyemail : null;
    console.log("user: ", user);
    if(user != null){
       const auth = await compare(password, user.password);
       if(auth){
            if(!user.confirmed){
                throw new Error(JSON.stringify({message: "Please validate your email to log in"}));
            }
            const token = createToken({user: {id: user._id, username: user.username, email: user.email}, secret: process.env.ACCESS_TOKEN_SECRET, expirydate: process.env.TOKEN_EXPIRY_DATE});
            return {token};
       }
    }
    throw new Error(JSON.stringify({message: "invalid credentials"}));
}

const signup = async({username, email, password, resetToken}) => {

    const user = await model.create({username: username, email: email, password: password, resetToken: resetToken});
    const token = createToken({user: {id: user._id, username: user.username, email: user.email}, secret: process.env.EMAIL_TOKEN_SECRET, expirydate: process.env.TOKEN_EXPIRY_DATE});
    await sendConfirmationEmail({email, token});
}

const confirmAndUpdateState = async({id}) => {
    console.log("id: ", id);
    await model.findByIdAndUpdate(id, {confirmed: true})
               .then(res => console.log("updated user successfully: ", res))
               .catch(err =>{
                    console.log("error occured");
                    throw Error(err);
               });
}

const forgotPassword = async(email) => {
    console.log("email: ", email);
    const user = await model.findOne({email: email});
    if(user){
        const token = createToken({user: {id: user._id, username: user.username, email: user.email}, secret: process.env.RESET_PASS_TOKEN_SECRET, expirydate: process.env.RESET_PASS_TOKEN_EXPIRY_DATE});
        console.log("token: ", token);
        await sendResetPasswordEmail({email, token});
        
    }else{
        throw Error("Email not found in system");
    }
}

const resetPassword = async({id, password}) => {
    const user = await model.findById(id);
    console.log("user: ", user);
    user.password = password;
    await user.save()
        .then(res => console.log("updated user password successfully: ", res))
        .catch(err => {
            console.log("error occured");
            throw Error(err);        
        });
}

const getById = async ({id}) => {
    console.log("iddd: ", id);
    const user = await model.findById(id);
    console.log("userrrr: ", user);
    return user;
}

export {login ,signup, getById, confirmAndUpdateState, forgotPassword, resetPassword};