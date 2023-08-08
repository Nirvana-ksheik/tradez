import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import moment from 'moment/moment.js';
import pkg from 'bcryptjs';
import {default as ModelItem} from '../models/Item.js';
import {sendConfirmationEmail, sendResetPasswordEmail} from '../helpers/emailHelper.js';
import { Role } from '../models/Statics.js';
import model, { UserModel } from '../models/User.js';
import {default as ModelTradez} from '../models/Tradez.js';
import { ImageModel } from '../models/Image.js';

const { compare } = pkg;
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
            const role = user.isAdmin ? Role.ADMIN : Role.USER;
            const token = createToken({user: {id: user._id, username: user.username, email: user.email}, secret: process.env.ACCESS_TOKEN_SECRET, role: role, expirydate: process.env.TOKEN_EXPIRY_DATE});
            return {token};
       }
    }
    throw new Error(JSON.stringify({message: "invalid credentials"}));
}

const signup = async({username, email, password, resetToken}) => {

    const user = await model.create({username: username, email: email, password: password, resetToken: resetToken})
                        .catch((err)=>{
                            console.log("Error creating user: ", err);
                        });

    const token = createToken({user: {id: user._id, username: user.username, email: user.email}, secret: process.env.EMAIL_TOKEN_SECRET, role: Role.USER, expirydate: process.env.TOKEN_EXPIRY_DATE});
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
        const role = user.isAdmin ? Role.ADMIN : Role.USER;
        const token = createToken({user: {id: user._id, username: user.username, email: user.email}, secret: process.env.RESET_PASS_TOKEN_SECRET, role: role, expirydate: process.env.RESET_PASS_TOKEN_EXPIRY_DATE});
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
    const user = await model.findById(id);
    console.log("user: ", user);
    const userDTO = new UserModel(user);
    const itemNumbers = await ModelItem.find({ownerId: id});
    const numberOfTradez = await ModelTradez.find({$and:[
        {
            $or:[
                {primaryUserId: id},
                {secondaryUserId: id}
            ],
        },
        {accepted: true}
    ]});

    userDTO.totalItems = itemNumbers.length;
    userDTO.numberOfTradez = numberOfTradez.length;
    userDTO.createdDate = user.createdDate;
    return userDTO;
}

const getAllAdmins = async () => {
    const users = await model.find({isAdmin: true});
    const userIds = users.map(user => user._id);
    console.log("Admin ids: ", userIds);

    return userIds;
}

const updateProfilePic = async (image, id) => {
    const profile = ImageModel.getLogoImagePath(image);
    await model.findByIdAndUpdate(id, {logo: profile})
            .then((res) => {
                console.log("Profile picture updated successfully");
            })
            .catch((err) => {
                console.log("Error saving profile picture to database");
            });

    return profile;
}

export {login ,signup, getById, confirmAndUpdateState, forgotPassword, resetPassword, getAllAdmins, updateProfilePic};