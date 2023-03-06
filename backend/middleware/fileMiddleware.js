import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("reached file storage engine");
        if(!req.body._id){
          req.body._id = new mongoose.Types.ObjectId().toString();
        }
        const dir = createDirectory({userId: req.user.id, itemId: req.body._id});
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname);
    }
});

const upload = multer({ storage: fileStorageEngine });

export default upload;

const createDirectory = ({userId, itemId}) => {
    console.log("itemId: ", itemId);
    const __filename = fileURLToPath(import.meta.url);
    console.log("filename: ", __filename);
    const __dirname = path.dirname(__filename);
    console.log("dirname: ", __dirname);
    const dir = path.resolve(path.join(__dirname, '..', 'public', userId.toString(), itemId.toString()));

    if (!fs.existsSync(dir)) {
      console.log("directory doesnt exists...");
      fs.mkdirSync(dir, {recursive: true});
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        mode: 0o744, // Not supported on Windows. Default: 0o777
      });
    }
    console.log("finished creating directory");

    return dir;
}
