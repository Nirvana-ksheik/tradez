import mongoose, {Schema} from 'mongoose';

const categorySchema = new Schema({
    name:{
        type: String,
        required: true
    }
});

const model = mongoose.model('Category', categorySchema);

export const schema = model.schema;
export default model;