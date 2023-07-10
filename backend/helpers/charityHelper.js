import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import pkg from 'bcryptjs';
const { compare } = pkg;
import model, { CharityModel } from '../models/Charity.js';
import { CharityStatus, Role } from '../models/Statics.js';
import moment from "moment/moment.js";
import {sendConfirmationEmail, sendResetPasswordEmail} from '../helpers/emailHelper.js';
import mongoose from 'mongoose';

dotenv.config();

const createToken = ({user, secret, role, expirydate}) =>{
    console.log("reached createToken");
    if(expirydate)
    {
        user.role = role;
        const token =  jwt.sign({...user}, secret, {
            expiresIn: expirydate
        });
        return token;
    }
    const token = jwt.sign({...user}, secret);
    return token;
}

const login = async ({registrationNb, password}) => {

    console.log("registration: ", registrationNb);
    const user = await model.findOne({ registrationNb: registrationNb });

    console.log("user: ", user);

    if(user != null){
       const auth = compare(password, user.password);
       if(auth){
            if(!user.confirmed){
                throw new Error(JSON.stringify({message: "Please validate your email to log in"}));
            }
            if(user.status == CharityStatus.REJECTED){
                throw new Error(JSON.stringify({message: "Your application has been rejected"}));
            }
            const token = createToken({
                user: {
                    id: user._id,
                    username: user.organizationName,
                    email: user.email,
                    status: user.status,
                    logo: user.logo
                }, secret: process.env.ACCESS_TOKEN_SECRET, role: Role.CHARITY, expirydate: process.env.TOKEN_EXPIRY_DATE});

            return {token};
       }
    }

    throw new Error(JSON.stringify({message: "Invalid credentials"}));
}

const signup = async(data) => {

    data.status = CharityStatus.PENDING;
    data.password = generateRandomPassword();

    const charity = await model.create({...data});
    const token = createToken({
        user: {
            id: charity._id,
            username: charity.organizationName,
            email: charity.email
        }, secret: process.env.EMAIL_TOKEN_SECRET, role: Role.CHARITY, expirydate: process.env.TOKEN_EXPIRY_DATE});

    await sendConfirmationEmail({email: charity.email, token, password: data.password, isCharity: true});
}

const confirmAndUpdateState = async(id) => {
    console.log(id);
    const charity = await model.findById(id);
    console.log("charity found: ", charity);
    charity.confirmed = true;
    await charity.save()
        .then(res => console.log("updated charity successfully: ", res))
        .catch(err =>{
            console.log("error occured");
            throw Error(err);
        });
}

const forgotPassword = async(email) => {
    console.log("email: ", email);
    const user = await model.findOne({email: email});
    if(user){
        const token = createToken({
            user: {
                id: user._id,
                username: user.organizationName,
                email: user.email
            }, secret: process.env.RESET_PASS_TOKEN_SECRET, role: Role.CHARITY, expirydate: process.env.TOKEN_EXPIRY_DATE});

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
    user.didChangePassword = true;
    await user.save()
        .then(res => console.log("updated user password successfully: ", res))
        .catch(err => {
            console.log("error occured");
            throw Error(err);        
        });
}

const getById = async (id) => {
    console.log("charity id: ", id);
    const user = await model.findById(id);
    const userDTO = new CharityModel(user);
    userDTO.createdDate = moment.utc(user.createdDate).format('DD/MM/YYYY');
    return userDTO;
}


const generateRandomPassword = ()=> {
    const availableCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let password = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * availableCharacters.length);
      password += availableCharacters.charAt(randomIndex);
    }
  
    return password;
}

const getAllCharities = async ({query}) => {
    const order = [];
    query.order ? order.push(query.order) : order.push("createdDate");
    query.orderDirection ? order.push(query.orderDirection) : order.push(-1);
    const charitiesQuery = model.find({...query}).sort([order]);
    charitiesQuery.getFilter();
    const searchText = query.searchText;
    console.log("role: ", query.role);

    if(searchText){
        charitiesQuery.find({
            $or:[
                {organizationName: { $regex: '.*' + searchText + '.*' }},
                {directors: { $regex: '.*' + searchText + '.*' }},
                {ceo: { $regex: '.*' + searchText + '.*' }},
                {mission: { $regex: '.*' + searchText + '.*' }},
                {additionalInfo: { $regex: '.*' + searchText + '.*' }},
                {website: { $regex: '.*' + searchText + '.*' }}
            ]
        });
        charitiesQuery.getFilter();
    }

    const charities = await charitiesQuery.exec();
    const charitiesResult = [];

    charities.forEach((data) => {
        const charityModel = new CharityModel(data);
        charitiesResult.push(charityModel);
    });

    return charitiesResult;
}

export {login ,signup, getById, confirmAndUpdateState, forgotPassword, resetPassword, getAllCharities};