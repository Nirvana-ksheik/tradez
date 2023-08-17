import mongoose from 'mongoose';
import model, { GetPostMetadataModel, PostCommentModel, PostModel } from '../models/Posts.js';
import { default as modelCharity } from '../models/Charity.js';
import { default as modelUser } from '../models/User.js';
import { convertUtcToClientDate } from './dateHelper.js';
import { map } from 'modern-async'

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

const getAllPosts = async ({query}) => {
    console.log("query in get all posts: ", query)
    const postsQuery = query.charityId ? 
        model.find({charityId: query.charityId}).sort([['publishedDate', -1]]) :
        model.find({}).sort([['publishedDate', -1]]);

        postsQuery.getFilter();

    const order = [];
    query.order ? order.push(query.order) : order.push("publishedDate");
    query.orderDirection ? order.push(query.orderDirection) : order.push(-1);

    postsQuery.sort([order]);
    postsQuery.getFilter();

    if(query.searchText){
        postsQuery.find({
            $or:[
                {description: { $regex: '.*' + query.searchText + '.*' }},
                {username: { $regex: '.*' + query.searchText + '.*' }}
            ]
        });
        postsQuery.getFilter();
    }

    const posts = await postsQuery.exec();

    const postsModels = [];
    
    if(posts && posts.length > 0){
        await map(posts, async (post) => {
            console.log("post before becoming postmodel: ", post);
            const postModel = new PostModel(post);
            const charity = await modelCharity.findById(post.charityId);
            if(charity){
                postModel.setLogo(charity.logo);
            }
            if(post.comments && post.comments.length > 0){
                await map(post.comments, async (comment) => {
                    const commentModel = new PostCommentModel(comment);
                    console.log("comment user id: ", commentModel.userId);
                    console.log("comment user id string: ", commentModel.userId.toString());
                    
                    const user = await modelUser.findById({_id: commentModel.userId.toString()})
                                    .catch((err) => {
                                        console.log("Error getting user from comment: ", err);
                                    }) ??
                                 await modelCharity.findById({_id: commentModel.userId.toString()})
                                    .catch((err) => {
                                        console.log("Error getting user from comment: ", err);
                                    });
                                    
                    commentModel.logo = user.logo;
                    commentModel.commentDate = convertUtcToClientDate({utcDate: comment.commentDate});   
                    postModel.comments.push(commentModel);
                })
            }
            postsModels.push(postModel);
        });
    }
    console.log("Posts: ", posts);
    return postsModels;
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

    const postModel = await getPostModel(newPost);

    console.log("new post with comment: ", postModel);
    return postModel;
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

    const postModel = await getPostModel(newPost);

    console.log("new post with comment: ", postModel);
    return postModel;
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

    const postModel = await getPostModel(newPost);

    console.log("new post with comment: ", postModel);
    return postModel;
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

    const postModel = await getPostModel(newPost);

    console.log("new post with comment: ", postModel);
    return postModel;
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

const getPostModel = async(post) => {
    const postModel = new PostModel(post);
    const charity = await modelCharity.findById(post.charityId);
    if(charity){
        postModel.setLogo(charity.logo);
    }
    if(post.comments && post.comments.length > 0){
        await map(post.comments, async (comment) => {
            const commentModel = new PostCommentModel(comment);
            console.log("comment user id: ", commentModel.userId);
            console.log("comment user id string: ", commentModel.userId.toString());
            
            const user = await modelUser.findById({_id: commentModel.userId.toString()})
                .catch((err) => {
                    console.log("Error getting user from comment: ", err);
                }) ??
                await modelCharity.findById({_id: commentModel.userId.toString()})
                .catch((err) => {
                    console.log("Error getting user from comment: ", err);
                });
                            
            commentModel.logo = user.logo;
            commentModel.commentDate = convertUtcToClientDate({utcDate: comment.commentDate});   
            postModel.comments.push(commentModel);
        })
    }

    return postModel;
}

export { createPost, editPost, getAllPosts, addPostComment, deletePostComment, likePostComment, unlikePostComment, getPostMetadata, deletePost };