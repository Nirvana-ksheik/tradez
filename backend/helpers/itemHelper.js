import model, {ItemModel} from '../models/Item.js';
import {default as userModel} from '../models/User.js';
import {default as imageModel} from '../models/Image.js';

const createItem = async ({item}) => {
    console.log("itemssss: ", {...item});
    return await model.create({ ...item })
    .catch(err =>{
         console.log("error occured");
         throw Error(err);
    });
}

const getItemById = async ({id}) => {
    console.log("id: ", id);
    const item = await model.findById(id);
    const itemOwner = await userModel.findById(item.ownerId);
    const imagePaths = [];
    for(const imageRef of item.imagesReferences){
        const img = await imageModel.findById(imageRef);
        imagePaths.push(img.path);
    }
    const itemResult = new ItemModel(item);
    itemResult.setImagePaths(imagePaths);
    itemResult.setItemId(item._id);
    itemResult.setItemOwner(itemOwner);
    return itemResult;
}

const getAllItems = async ({query}) => {
    const order = [];
    query.order ? order.push(query.order) : order.push("publishedDate");
    query.orderDirection ? order.push(query.orderDirection) : order.push(-1);
    const searchText = query.searchText;
    console.log("order: ", order);

    const itemsQuery = model.find({...query}).sort([order]);
    itemsQuery.getFilter();
    if(searchText){
        itemsQuery.find({
            $or:[
                {name: { $regex: '.*' + searchText + '.*' }},
                {locationName: { $regex: '.*' + searchText + '.*' }},
                {description: { $regex: '.*' + searchText + '.*' }}
            ]
        });
        itemsQuery.getFilter();
    }
    const items = await itemsQuery.exec();
    const itemsResult = [];
    for(const item of items){
        const imagePaths = [];
        for(const imageRef of item.imagesReferences){
            const img = await imageModel.findById(imageRef);
            imagePaths.push(img.path);
        }
        const itemResult = new ItemModel(item);
        itemResult.setImagePaths(imagePaths);
        itemResult.setItemId(item._id);
        itemsResult.push(itemResult);
    }
    
    return itemsResult;
}

export { createItem, getItemById, getAllItems };