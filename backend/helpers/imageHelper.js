import model from '../models/Image.js';

const createImagesAndReturnIds = async (files) => {
    console.log("files: ", files);
    const fileIds = [];
    for(const file of files){
        try{
            const res = await model.create({...file});
            console.log("saved images successfully: ", res);
            fileIds.push(res._id);
        }
        catch(err) {
            console.log("error occured while saving image in database");
            throw Error(err);
        };
    }

    console.log("file ids: ", fileIds);
    return fileIds;
}

export { createImagesAndReturnIds };