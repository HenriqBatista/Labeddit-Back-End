import express from 'express';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { CommentBusiness } from '../business/CommentBusiness';
import { CommentDatabase } from '../database/CommentDatabase';
import { PostDatabase } from '../database/PostDatabase';
import { CommentController } from '../controller/CommentController';



export const commentRouter = express.Router();

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager(),
    )
);

commentRouter.post("/:postId/comments", commentController.createComment)
commentRouter.put("/:postId/comments/:commentId", commentController.editComment)
commentRouter.put("/:postId/comments/:commentId/like", commentController.likeOrDislikeComment)
commentRouter.delete("/:postId/comments/:commentId", commentController.deleteComment)