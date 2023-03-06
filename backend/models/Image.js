import mongoose, {Schema} from 'mongoose';

const imageSchema = new Schema({

    originalname: {
        type: String,
        required: true
    },
    mimetype: {
        type: String
    },
    path: {
        type: String
    }
});

export class ImageModel {
    constructor({image}){
        this.originalname = image.originalname;
        this.mimetype = image.mimetype;
        this.path = image.path.split("public")[1];
    }

    static getImages(images){
        let imagesArray = [];
        images.forEach(image => {
            const img = new ImageModel({image});
            imagesArray.push(img);
        });
        console.log("images: ", imagesArray);
        return imagesArray;
    }
}

const model = mongoose.model('Image', imageSchema);

export const schema = model.schema;
export default model;