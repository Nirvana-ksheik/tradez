import mongoose from 'mongoose';
import model, { GetPostMetadataModel } from '../models/Posts.js';
import { convertUtcToClientDate } from './dateHelper.js';

const createPost = async ({post}) => {
    console.log("post: ", {...post});
    return await model.create({ ...post })
    .catch(err =>{
         console.log("error occured");
         throw Error(err);
    });
}

const editPost = async ({post}) => {
    console.log("posts: ", {...post});    

    if(post.imagesReferences == null || post.imagesReferences == undefined || post.imagesReferences == []){
        const tempPost = await model.findById(post._id);
        post.imagesReferences = tempPost.imagesReferences;
    }

    return await model.findByIdAndUpdate(post._id, { ...post })
    .catch(err =>{
         console.log("error occured: ", err);
         throw Error(err);
    });
}

const getAllPosts = async () => {

    const posts = await model.find({}).sort([['publishedDate', -1]]);
    if(posts && posts.length > 0){
        posts.forEach((post) => {
            if(post.comments && post.comments.length > 0){
                post.comments.forEach((comment) => {
                    comment.commentDate = convertUtcToClientDate({utcDate: comment.commentDate});                    
                })
            }
        })
    }
    console.log("Posts: ", posts);
    return posts;
}

const addPostComment = async ({postId, commentText, userId, username}) => {
    console.log("comment text is: ", commentText);
    console.log("userId is: ", userId);
    console.log("post id is: ", postId);

    const newPost = await model.findByIdAndUpdate(postId,
        { $push: {"comments": 
            {
                _id: new mongoose.Types.ObjectId(),
                commentText: commentText,
                userId: userId,
                username: username
            }} },
        {  safe: true, upsert: true, new: true }
    ).catch((err) => {
        console.log("Error adding comment: ", err);
    });

    console.log("new post with comment: ", newPost);
    return newPost;
}

const deletePostComment = async ({postId, commentId}) => {
    console.log("comment id is: ", commentId);
    console.log("post id is: ", postId);

    const newPost = await model.findByIdAndUpdate(postId,
        { $pull: { comments: { _id: mongoose.Types.ObjectId(commentId) } } },
        { new: true, safe: true}
    ).catch((err) => {
        console.log("Error adding comment: ", err);
    });

    console.log("new post without comment: ", newPost);

    return newPost;
}

const likePostComment = async ({postId, userId}) => {

    console.log("Reached helper, userId: ", userId, " postId: ", postId);

    let newPost = undefined;

    await model.findByIdAndUpdate(mongoose.Types.ObjectId(postId),
        { $push: { 'likes': {userId: mongoose.Types.ObjectId(userId)} } },
        {  safe: true, upsert: true, new: true}
    )
    .then((res) => {
        console.log("new Post: ", res);
        newPost = res;
    })
    .catch((err) => {
        console.log("Error adding comment: ", err);
    });


    return newPost;
}

const unlikePostComment = async ({postId, userId}) => {

    let newPost = undefined;

    await model.findByIdAndUpdate(mongoose.Types.ObjectId(postId),
        { $pull: { 'likes': {  userId: mongoose.Types.ObjectId(userId) } } },
        { new: true }
    )
    .then((res) => {
        console.log("new Post: ", res);
        newPost = res;
    })
    .catch((err) => {
        console.log("Error adding comment: ", err);
    });

    return newPost;
}

const getPostMetadata = async (postId) => {
    console.log("postId in getPostMetadata: ", postId);
    const post = await model.findById(postId)
        .catch((err)=> {
            console.log("Error getting post: ", err);
        });
    console.log("post in getPostMetadata: ", post);
    const postModel = new GetPostMetadataModel(post);
    return postModel;    
}

const deletePost = async ({postId}) => {
    await model.findOneAndDelete(postId)
        .then((res) => {
            console.log("Deleted post successfully")
        })
        .catch((err)=> {
            console.log("Error getting post: ", err);
        });
}
export { createPost, editPost, getAllPosts, addPostComment, deletePostComment, likePostComment, unlikePostComment, getPostMetadata, deletePost };