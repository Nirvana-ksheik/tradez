import * as dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import model from '../models/User.js';
dotenv.config();

const checkUser = (req, res, next)=>{
    console.log('reached checking user token');
    console.log("cookie: ", req.headers.cookie);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('token: ', token);
    if(token == null){
        return res.sendStatus(401).json({message: "not authorized"});
    }
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403).json({message: "invalid token"});
        }
        req.user = user;
        console.log("user in check user is: ", user);
        next();
    });
}

const checkConfirmationEmailToken = (req, res, next)=>{
    const token = req.params.token;
    console.log("token: ", token);
    verify(token, process.env.EMAIL_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403);
        }
        console.log("user from token: ", user);
        req.user = user;
        next();
    });
}

const checkResetPasswordToken = (req, res, next) =>{
    const token = req.params.token;
    console.log("token: ", token);
    verify(token, process.env.RESET_PASS_TOKEN_SECRET, (err, user) => {
        if(err){
            console.log("token no longer active");
            return res.status(403).json({message: "Token no longer active"});
        }
        console.log("user from token: ", user);
        req.user = user;
        next();
    }); 
}

const   loginHandleErrors = async(req, res, next) => {

    const {username, password } = req.body;

    if(!username || !password){
        return res.status(400).json({message: 'All fields are required'});
    }

    next();
}

const signupHandleErrors = async(req, res, next) => {

    const { username, email, password } = req.body;

    if(!username || !password || !email){
        return res.status(400).json({message: "All fields are required"});
    }

    let userRegistered = await model.findOne({username});
    let emailRegistered = await model.findOne({email});

    if(userRegistered){
        return res.status(400).json({message: "User already registered"});
    }
    if(emailRegistered){
        return res.status(400).json({message: "Email already registered"});
    }

    next();
}

export { checkUser, loginHandleErrors, signupHandleErrors, checkConfirmationEmailToken, checkResetPasswordToken };