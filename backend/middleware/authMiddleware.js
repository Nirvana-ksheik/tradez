import * as dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import { Role } from '../models/Statics.js';
dotenv.config();

const checkUser = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.sendStatus(401).json({message: "not authorized"});
    }
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403).json({message: "invalid token"});
        }
        if(user.role != Role.USER){
            return res.sendStatus(403).json({message: "UnAuthorized"});
        }
        req.user = user;
        next();
    });
}

const checkCharity = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.sendStatus(401).json({message: "not authorized"});
    }
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403).json({message: "invalid token"});
        }
        if(user.role != Role.CHARITY){
            return res.sendStatus(403).json({message: "UnAuthorized"});
        }
        req.user = user;
        next();
    });
}

const checkAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.sendStatus(401).json({message: "not authorized"});
    }
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403).json({message: "invalid token"});
        }
        if(user.role != Role.ADMIN){
            return res.sendStatus(403).json({message: "UnAuthorized"});
        }
        req.user = user;
        next();
    });
}

const checkToken = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.sendStatus(401).json({message: "not authorized"});
    }
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403).json({message: "invalid token"});
        }
        req.user = user;
        console.log("user in checkToken middleware is: ", user);
        next();
    });
}

const checkConfirmationEmailToken = (req, res, next)=>{
    const token = req.params.token;
    verify(token, process.env.EMAIL_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

const checkResetPasswordToken = (req, res, next) =>{
    const token = req.params.token;
    verify(token, process.env.RESET_PASS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({message: "Token no longer active"});
        }
        req.user = user;
        next();
    }); 
}

export { checkUser, checkAdmin, checkToken, checkConfirmationEmailToken, checkResetPasswordToken, checkCharity};