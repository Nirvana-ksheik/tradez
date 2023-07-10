import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log("reached file storage engine");
      if(file != null && file != undefined && file != [] && file != ''){
          console.log("item Id in file storage: ", req.body._id);
          if(req.body._id == null || req.body._id == undefined){
            req.body._id = new mongoose.Types.ObjectId().toString();
          }
          const dir = createDirectory({userId: req.user.id, itemId: req.body._id});
          cb(null, dir);
      }
    },
    filename: (req, file, cb) => {
      if(file != null && file != undefined && file != [] && file != ''){
        console.log("file: ", file);
        cb(null, Date.now() + '--' + file.originalname);
        console.log("created file...");
      }
    }
});

const logoStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("reached file storage engine");
    if(file != null && file != undefined && file != [] && file != ''){
        console.log("logo Id in file storage: ", req.body._id);
        if(req.body._id == null || req.body._id == undefined){
          req.body._id = new mongoose.Types.ObjectId().toString();
        }
        const dir = createDirectory({userId: req.body._id, itemId: "logo"});
        cb(null, dir);
    }
  },
  filename: (req, file, cb) => {
    if(file != null && file != undefined && file != [] && file != ''){
      console.log("file: ", file);
      cb(null, Date.now() + '--' + file.originalname);
      console.log("created file...");
    }
  }
});

const createDirectory = ({userId, itemId}) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dir = path.resolve(path.join(__dirname, '..', 'public', userId.toString(), itemId.toString()));
    console.log("directory in first createDirectory: ", dir)
    createDirectoryFunc(dir);
    return dir;
}

function createDirectoryFunc(dir) {
  console.log("path: ", dir);
  if(fs.existsSync(dir)){
    console.log(`Directory ${dir} already exists`);
  }
  else{
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory ${dir} created`);
  }
  return dir;
}

const upload = multer({ storage: fileStorageEngine });

export const logoUpload = multer({ storage: logoStorageEngine });
export default upload;