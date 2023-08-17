import fs from 'fs';
import qrcode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

export const generateQrCode = async (result) => {

    console.log("userId: ", result.ownerId, " ---------- ", "itemId: ", result._id);
    
    const data = JSON.stringify({
      id: result._id.toString(),
      name: result.name,
      createdDate: result.publishedDate.toString(),
      ownerId: result.ownerId.toString()
    });

    const dir = createDirectory({userId : result.ownerId.toString(), itemId: result._id.toString()});
    const filePath = path.join(dir, result._id.toString() + "--qrCode.png");

    try {
      qrcode.toFile(filePath, data, { type: 'png' });
      console.log('QR code saved as', filePath);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
};

const createDirectory = ({userId, itemId}) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dir = path.resolve(path.join(__dirname, '..', 'public', userId.toString(), itemId.toString(), "qr-code"));
    console.log("directory in first createDirectory: ", dir)
    createDirectoryFunc(dir);
    return dir;
}

function createDirectoryFunc(dir) {
  console.log("path: ", dir);
  if(fs.existsSync(dir)){
    console.log(`Directory ${dir} already exists`);
    fs.rmdirSync(dir);
  }
  else{
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory ${dir} created`);
  }
  return dir;
}