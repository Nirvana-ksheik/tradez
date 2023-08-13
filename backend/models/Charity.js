import mongoose, {Schema} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
const { genSalt, hash } = bcrypt;
const {isEmail} = validator;

const charitySchemma = new Schema({
    _id:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    organizationName:{
        type: String,
        require: true
    },
    address:{
        type: String,
        require: true
    },
    telephoneNb:{
        type: String,
        require: true
    },
    website:{
        type: String,
        require: true
    },
    registrationNb:{
        type: String,
        require: true
    },
    taxNb:{
        type: String,
        require: true
    },
    directors:{
        type: String,
        require: true
    },
    ceo:{
        type: String,
        require: true
    },
    annualTurnover:{
        type: String,
        require: true
    },
    mission:{
        type: String,
        require: true
    },
    additionalInfo:{
        type: String,
        require: true
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    confirmed:{
        type: Boolean,
        default: false
    },
    password:{
        type: String,
        reuired: true
    },
    status:{
        type: String,
        require: true
    },
    didChangePassword: {
        type: Boolean,
        default: false
    },
    logo:{
        type: String
    },
    categories: [{
        type: Number
    }],
    rejectMessage: {
        type: String
    },
    followers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId
        }
    }],
    createdDate: {
        type: Date,
        default: new Date().toISOString()
    }
}, {_id: false});

charitySchemma.post('save', function(doc, next){
    console.log('user has been saved and added successfully');
    next();
});

charitySchemma.pre('save', async function(next){
    const salt = await genSalt();
    this.password = hash(this.password, salt);
    next();
});

export class CharityModel {

    constructor(data){
        this._id = data.id;
        this.organizationName = data.organizationName;
        this.address = data.address;
        this.telephoneNb = data.telephoneNb;
        this.website = data.website;
        this.registrationNb = data.registrationNb;
        this.taxNb = data.taxNb;
        this.directors = data.directors;
        this.ceo = data.ceo;
        this.annualTurnover = data.annualTurnover;
        this.mission = data.mission;
        this.additionalInfo = data.additionalInfo;
        this.email = data.email;
        this.confirmed = data.confirmed;
        this.status = data.status;
        this.didChangePassword = data.didChangePassword;
        this.logo = data.logo;
        this.categories = data.categories;
        this.rejectMessage = data.rejectMessage;
        this.followers = data.followers;
        this.createdDate = data.createdDate;
    }
}

const model = mongoose.model('Charity', charitySchemma);

export const schema = model.schema;

export default model;