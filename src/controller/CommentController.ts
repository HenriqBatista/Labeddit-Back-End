import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { CommentBusiness } from "../business/CommentBusiness";
import { CreateCommentSchema } from "../dtos/comment/createComment.dto";
import {
  EditCommentInputDTO,
  EditCommentOutputDTO,
  EditCommentSchema,
} from "../dtos/comment/editComment.dto";
import {
  DeleteCommentByIdInputDTO,
  DeleteCommentByIdOutputDTO,
  DeleteCommentByIdSchema,
} from "../dtos/comment/deleteCommentById.dto";
import { LikeDislikeCommentInputDTO, LikeDislikeCommentOutputDTO, LikeDislikeCommentSchema } from "../dtos/comment/likeDislikeComment.dto";

export class CommentController {
  constructor(private commentBusiness: CommentBusiness) {}

  public createComment = async (req: Request, res: Response) => {
    try {
      const input = CreateCommentSchema.parse({
        postId: req.params.postId,
        content: req.body.content,
        token: req.headers.authorization,
      });

      const output = await this.commentBusiness.createComment(input);
      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res
          .status(400)
          .send(`${error.issues[0].path[0]}: ${error.issues[0].message}`);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public editComment = async (req: Request, res: Response) => {
    try {
      const input: EditCommentInputDTO = EditCommentSchema.parse({
        postId: req.params.postId,
        commentId: req.params.commentId,
        content: req.body.content,
        token: req.headers.authorization,
      });

      const output: EditCommentOutputDTO =
        await this.commentBusiness.editCommentById(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res
          .status(400)
          .send(`${error.issues[0].path[0]}: ${error.issues[0].message}`);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public deleteComment = async (req: Request, res: Response) => {
    try {
      const input: DeleteCommentByIdInputDTO = DeleteCommentByIdSchema.parse({
        postId: req.params.postId,
        commentId: req.params.commentId,
        token: req.headers.authorization,
      });

      const output: DeleteCommentByIdOutputDTO =
        await this.commentBusiness.deleteComment(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res
          .status(400)
          .send(`${error.issues[0].path[0]}: ${error.issues[0].message}`);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public likeOrDislikeComment = async (req: Request, res: Response) =>{
    try {
        const input: LikeDislikeCommentInputDTO = LikeDislikeCommentSchema.parse({
            postId : req.params.postId,
            commentId : req.params.commentId,
            token: req.headers.authorization,
            like: req.body.like
        })

        const output: LikeDislikeCommentOutputDTO = await this.commentBusiness.likeOrDislikeComment(input)
        res.status(200).send(output)
        
    } catch (error) {
        console.log(error);

      if (error instanceof ZodError) {
        res
          .status(400)
          .send(`${error.issues[0].path[0]}: ${error.issues[0].message}`);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  }
}
