import * as dotenv from 'dotenv';
import { login, signup, confirmAndUpdateState, forgotPassword, resetPassword, getById, getAllAdmins, updateProfilePic } from '../helpers/authHelper.js';
import { deleteProfilePicWithUserId } from '../helpers/fileHelper.js';

dotenv.config();

const _login = async (req, res) => {

    const { username, password } = req.body;

    try {
        const token  = await login({username, password});
        res.status(200).json(token); 
        console.log("logged in");
    } catch (error) {
        console.log("error: ", error.message);  
        res.status(400).json(error.message);
    }
};
export { _login as loginController };

const _signup = async (req, res) => {
    
    console.log("reached signup api");
    const { username, email, password } = req.body;

    try {
        await signup({ username: username, email: email, password: password, resetToken: null });
        console.log("finished signup process");
        res.status(200).json("Please validate your email to log in");
    } catch ({error}) {
        console.log("error: ", error);
        res.status(401).json(error);
    }
};
export { _signup as signupController };

const _logout = async (req, res) => {
    try {
        res.cookie('jwt', '', {maxAge: 1});
        res.status(200).json("Logged out successfully");
    } catch (err) {
        res.status(401).json({ err });
    }
};
export { _logout as logoutController };

const _confirm = async (req, res) => {
    try{
        const id = req.user.id;
        await confirmAndUpdateState({ id: id });
        console.log("finished confirming email");
        res.status(200).json("email confirmed successfully");
    } catch (err){
        res.status(401).json({ err });
    }
};
export {_confirm as confirmController };

const _forgotPassword = async(req, res) => {
    try{
        const {email} = req.body;
        console.log("email: ", email);
        await forgotPassword(email);
        console.log("reset password link sent successfully");
        res.status(200).json("A reset link has been sent to your email");
    } catch(err){
        console.log("error: ", err.message);
        res.status(500).json(err.message);
    }
}
export {_forgotPassword as forgotPasswordController};

const _resetPassword = async(req, res) => {
    try{
        const {password} = req.body;
        console.log("password: ", password);
        const id = req.user.id;
        console.log("id: ", id);
        await resetPassword({id, password});
        console.log("finished resetting password successfully");
        res.status(200).json("Password updated successfully");
    } catch(err){
        console.log("err: ", err);
        res.status(401).json({err});
    }
};
export {_resetPassword as resetPasswordController};

const _getUserProfile = async(req, res) => {
    try{
        const id =  req.params.id;
        console.log("user id in controller: ", id);
        const result = await getById({id});
        console.log("result is: ", result);
        res.status(200).json({result});
    } catch(err){
        res.status(500).json({err});
    }
};
export {_getUserProfile as getUserProfileController};

const _getAllAdmins = async(req, res) => {
    try{
        const result = await getAllAdmins();
        console.log("result is: ", result);
        res.status(200).json({result});
    } catch(err){
        res.status(500).json({err});
    }
};
export {_getAllAdmins as getAllAdminsController};

const _updateProfilePicture = async(req, res) => {
    try{
        const image = req.file;
        const id = req.user.id;
        await deleteProfilePicWithUserId(id);
        const result = await updateProfilePic(image, id);
        console.log("result is: ", result);
        res.status(200).json({result});
    } catch(err){
        res.status(500).json({err});
    }
};
export {_updateProfilePicture as updateProfilePictureController};