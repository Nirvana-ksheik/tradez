import * as dotenv from 'dotenv';
import { PostModel } from '../models/Posts.js';
import { ImageModel } from '../models/Image.js';
import * as helper from '../helpers/postHelper.js';
import { deleteFilesWithPostId } from '../helpers/fileHelper.js';

dotenv.config();

const _createPostController = async (req, res) => {
    console.log("request body: ", req.body);
    try {
        req.body.charityId = req.user.id;
        req.body.username = req.user.username;
        const post = new PostModel(req.body);
        console.log("post: ", post);
        const images = ImageModel.getImagesPaths(req.files);
        post.imagesReferences = images;
        const result = await helper.createPost({post});
        res.status(200).json(result);
        console.log("finished creating post");
    } catch (err) {
        res.status(500).json(err.message);
    }
};
export { _createPostController as createPostController };

const _editPostController = async (req, res) => {

    console.log("request body: ", req.body);
    console.log("request files: ", req.files);
    
    try {
        const post = new PostModel(req.body);
        console.log("post: ", post);
        const files = req.files;
        console.log("files: ", files);
        if(files != [] && files != null && files != undefined && files != ''){
            console.log("item id: ", post._id);
            await deleteFilesWithPostId(post._id);
            const images = ImageModel.getImages(req.files);
            post.images = images;
        }
        const result = await helper.editPost({post});
        res.status(200).json(result);
        console.log("finished editing post");
    } catch (err) {
        res.status(500).json(err.message);
    }
};
export { _editPostController as editPostController };

const _deletePostController = async (req, res) => {

    const postId = req.params.id;

    try {
        console.log("postId: ", postId);
        await helper.deletePost({postId});
        res.status(200).json("Successfully deleted post");
        console.log("finished editing post");
    } catch (err) {
        res.status(500).json(err.message);
    }
};
export { _deletePostController as deletePostController };

const _getAllPostsController = async (req, res) => {

    console.log("reached get all user posts controller");
    try{
        const query = req.query;
        const posts = await helper.getAllPosts({query});
        res.status(200).json(posts);
        console.log("finished getting posts for user");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _getAllPostsController as getAllPostsController };

const _getPostById = async (req, res) => {

    console.log("reached get user posts controller");
    try{
        const postId = req.params.id;
        console.log("postId: ", postId);
        const post = await helper.getPostMetadata(postId);
        res.status(200).json(post);
        console.log("finished getting post");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _getPostById as getPostById };

const _addPostCommentController = async (req, res) => {

    const body = req.body;
    const userId = req.user.id;
    const postId = req.params.id;
    const username = req.user.username;

    console.log("reached add user post comments controller");
    try{
        const post = await helper.addPostComment({postId: postId, commentText: body.commentText, userId: userId, username: username});
        res.status(200).json(post);
        console.log("finished add user post comments");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _addPostCommentController as addPostCommentController };

const _deletePostCommentController = async (req, res) => {

    const postId = req.params.id;
    const commentId = req.params.commentId;
    console.log("reached delete post comments controller");
    try{
        const post = await helper.deletePostComment({postId: postId, commentId: commentId});
        res.status(200).json(post);
        console.log("finished delete post comments");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _deletePostCommentController as deletePostCommentController };

const _likePostCommentController = async (req, res) => {

    const postId = req.params.id;
    const userId = req.user.id;
    console.log("reached like post comment controller");
    try{
        const post = await helper.likePostComment({postId: postId, userId: userId});
        res.status(200).json(post);
        console.log("finished like post comments");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _likePostCommentController as likePostCommentController };

const _unlikePostCommentController = async (req, res) => {

    const postId = req.params.id;
    const userId = req.user.id;
    console.log("reached unlike post comment controller");
    try{
        const post = await helper.unlikePostComment({postId: postId, userId: userId});
        res.status(200).json(post);
        console.log("finished unlike post comments");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _unlikePostCommentController as unlikePostCommentController };