import mongoose, {Schema} from 'mongoose';

const subscriptionSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    subscription: {
        endpoint: {
            type: String
        },
        expirationTime: {
            type: Number
        },
        keys: {
            p256dh: {
                type: String
            },
            auth: {
                type: String
            }
        }
    }

});

const model = mongoose.model('Subscription', subscriptionSchema);

export const schema = model.schema;
export default model;