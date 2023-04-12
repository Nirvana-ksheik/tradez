import * as dotenv from 'dotenv';
import { CommentModel } from '../models/Comment.js';
import { addComment, getComments, getCommentReplies } from '../helpers/commentHelper.js';

dotenv.config();

const _addCommentController = async (req, res) => {
    console.log("request body: ", req.body);
    try {
        const commentBody = req.body;
        const userId = req.user.id;
        console.log("userId: ", userId);
        commentBody.userId = userId;
        const commentModel = new CommentModel(commentBody);
        const result = await addComment(commentModel);
        console.log("result: ", result);
        res.status(200).json(result);
    } catch (err) {
        console.log("err ", err);
        res.status(500).json(err.message);
    }
};
export { _addCommentController as addCommentController };

const _getCommentsController = async (req, res) => {
    console.log("request body: ", req.body);
    try {
        const itemId = req.params.itemId;
        console.log("itemId: ", itemId);
        const comments = await getComments(itemId);
        console.log("comments: ", comments);
        res.status(200).json(comments);
    } catch (err) {
        console.log("err ", err);
        res.status(500).json(err.message);
    }
};
export { _getCommentsController as getCommentsController };

const _getCommentRepliesController = async (req, res) => {
    console.log("request body: ", req.body);
    try {
        const commentId = req.params.commentId;
        console.log("commentId: ", commentId);
        const replies = await getCommentReplies(commentId);
        console.log("replies: ", replies);
        res.status(200).json(replies);
    } catch (err) {
        console.log("err ", err);
        res.status(500).json(err.message);
    }
};
export { _getCommentRepliesController as getCommentRepliesController };