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

    static getImagesPaths(images){
        console.log("images in getImages path: ", images);
        let imagePathArray = [];
        images.forEach(image => {
            const path = image.path.split('public')[1];
            imagePathArray.push(path);
        });
        
        return imagePathArray;
    }

    static getLogoImagePath(image){
        console.log("image in getLogoImagePath: ", image);
        const path = image.path.split('public')[1];
        return path;
    }
}

const model = mongoose.model('Image', imageSchema);

export const schema = model.schema;
export default model;