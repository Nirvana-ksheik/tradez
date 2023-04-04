import {default as imageModel} from '../models/Image.js'
import {default as itemModel} from '../models/Item.js'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const deleteFilesWithItemId = async(id) => {
    console.log("item id: ", id);
    const item = await itemModel.findById(id);
    const images = await imageModel.find({'_id': {$in: item.imagesReferences}});
    console.log("images: ", images);

    const __filename = fileURLToPath(import.meta.url);
    console.log("filename: ", __filename);
    const __dirname = path.dirname(__filename);
    console.log("dirname: ", __dirname);
    const public_dir = path.resolve(path.join(__dirname, '..', 'public'));

    images.forEach((image, i) => {
        let full_directory = public_dir + image.path;
        if(fs.existsSync(full_directory)){
            console.log("started deleting directory: ", full_directory);
            fs.rmSync(full_directory, {recursive: true});
            console.log("finished.....");
        }
    });
}

export {deleteFilesWithItemId}