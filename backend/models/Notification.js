import mongoose, {Schema} from 'mongoose';

const notificationSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    createdDate:{
        type: Date,
        default: Date.now()
    }
});

export class NotificationModel {
    constructor(data){
        this.title = data.title;
        this.message = data.message;
        this.userId = data.userId;
        this.createdDate = data.createdDate;
    }
}
const model = mongoose.model('Notification', notificationSchema);

export const schema = model.schema;
export default model;