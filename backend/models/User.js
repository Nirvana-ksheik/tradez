import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
const { genSalt, hash } = bcrypt;
const {isEmail} = validator;

const userSchema = new Schema({
    username:{
        type: String,
        unique: true
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 character']
    },
    confirmed:{
        type: Boolean,
        default: false
    },
    resetToken:{
        type: String,
    }
});

userSchema.post('save', function(doc, next){
    console.log('user has been saved and added successfully');
    next();
});

userSchema.pre('save', async function(next){
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next();
});

export class UserModel {

    constructor(data){

        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
    }
}

const model = mongoose.model('User', userSchema);

export const schema = model.schema;
export default model;