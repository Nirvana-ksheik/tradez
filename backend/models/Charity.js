import mongoose, {Schema} from 'mongoose';
import validator from 'validator';
const {isEmail} = validator;

const charitySchemma = new Schema({
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
        type: String
    },
    status:{
        type: String,
        require: true
    },
    createdDate: {
        type: Date,
        default: new Date().toISOString()
    }
});

export class CharityModel {

    constructor(data){

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
        this.createdDate = data.createdDate;
    }
}

const model = mongoose.model('Charity', charitySchemma);

export const schema = model.schema;
export default model;