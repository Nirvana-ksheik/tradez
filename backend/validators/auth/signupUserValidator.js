import model from "../../models/User.js";

export const _signupUserValidator = async (req, res, next) => {

    const { username, email, password } = req.body;

    if(!username || !password || !email){
        return res.status(400).json({message: "All fields are required"});
    }
    console.log("password length is: ", password.length)
    if(password.length < 6){
        return res.status(400).json({message: "Minimum password length is 6 character"});
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