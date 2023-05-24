import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comment/createComment.dto";
import { DeleteCommentByIdInputDTO, DeleteCommentByIdOutputDTO } from "../dtos/comment/deleteCommentById.dto";
import { EditCommentInputDTO } from "../dtos/comment/editComment.dto";
import { EditCommentOutputDTO } from "../dtos/comment/editComment.dto";
import { LikeDislikeCommentInputDTO, LikeDislikeCommentOutputDTO } from "../dtos/comment/likeDislikeComment.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { COMMENT_LIKE, Comment, CommentDB, LikeDislikeCommentDB } from "../models/Comment";
import { PostDBAndCreatorName } from "../models/Post";
import { Post, PostDB } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload, USER_ROLES } from "../services/TokenManager";


export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> =>{
        const {postId, content, token} = input
        const payload: TokenPayload|null = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError()
        }
        const postDB: PostDB| undefined = await this.postDatabase.findPostById(postId)
        if(!postDB){
            throw new NotFoundError("Post não encontrado.")
        }
        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.comments,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            postDB.creator_id,
            payload.name
        )

        const id = this.idGenerator.generate()

        const newComment = new Comment(
            id,
            postId,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const newCommentDB: CommentDB = newComment.toCommentDBModel()
        await this.commentDatabase.insertComment(newCommentDB)

        post.setComments(1)
        const updatedPostDB:PostDB = post.toPostDBModel()
        await this.postDatabase.editPost(updatedPostDB)

        const output: CreateCommentOutputDTO = {
            message: "Comentário adicionado a publicação com sucesso."
        }

        return output as CreateCommentOutputDTO
    }

    public editCommentById = async (input: EditCommentInputDTO): Promise <EditCommentOutputDTO>=>{
        const {postId, commentId, content, token } = input
        const payload: TokenPayload| null = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError
        }
        const postDB: PostDB | undefined = await this.postDatabase.findPostById(postId)

        if(!postDB){
            throw new NotFoundError("Post não encontrado.")
        }

        const commentDB: CommentDB| undefined = await this.commentDatabase.getCommentById(commentId)

        if(!commentDB){
            throw new NotFoundError("Comentário não encontrado.")
        }

        if(payload.role !== USER_ROLES.ADMIN){
            if(payload.id !== commentDB.creator_id){
                throw new ForbiddenError("Somente o criador do comentário ou um Admin pode editar um comentário.")
            }
        }

        const comment = new Comment(
            commentDB.id,
            commentDB.post_id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.creator_id,
            payload.name
        )

        comment.setContent(content)
        const update = new Date().toISOString()
        comment.setUpdatedAt(update)

        const updatedCommentDB: CommentDB = comment.toCommentDBModel()
        await this.commentDatabase.updateComment(updatedCommentDB)

        const output: EditCommentOutputDTO = {
            message: "Comentário atualizado."
        }

        return output
    }

    public deleteComment = async (input: DeleteCommentByIdInputDTO):Promise<DeleteCommentByIdOutputDTO> =>{

        const {postId, commentId, token} = input
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError()
        }

        const commentDB: CommentDB|undefined = await this.commentDatabase.getCommentById(commentId)
        if(!commentDB){
            throw new NotFoundError("Comentário não encontrado.")
        }

        const postAndCreatorDB: PostDBAndCreatorName | undefined = await this.postDatabase.findPostAndCreatorDBById(postId)

        if(!postAndCreatorDB){
            throw new NotFoundError("Post não encontrado.")
        }

        if(payload.role !== USER_ROLES.ADMIN){
            if(payload.id !== postAndCreatorDB.creator_id){
                if(payload.id !== commentDB.creator_id){
                    throw new ForbiddenError("Somente o criador do comentário ou uma pessoa Admin pode excluir o comentário.")
                }
            }
        }

        await this.commentDatabase.deleteCommentById(commentId)

        const post = new Post(
            postAndCreatorDB.id,
            postAndCreatorDB.content,
            postAndCreatorDB.comments,
            postAndCreatorDB.likes,
            postAndCreatorDB.dislikes,
            postAndCreatorDB.created_at,
            postAndCreatorDB.updated_at,
            postAndCreatorDB.creator_id,
            postAndCreatorDB.creator_name,
        )

        post.removeComments()
        const updatePostDB: PostDB = post.toPostDBModel()
        await this.postDatabase.editPost(updatePostDB)

        const output: DeleteCommentByIdOutputDTO = {
            message: "Comentário deletado."
        }

        return output
    }

    public likeOrDislikeComment = async (
        input: LikeDislikeCommentInputDTO
       ):Promise<LikeDislikeCommentOutputDTO>=>{
        const {token, postId, like, commentId} = input
    
        const payload = this.tokenManager.getPayload(token)
        if(!payload){
            throw new UnauthorizedError("Token inválido")
        }
    
        const commentAndCreatorDB = await this.commentDatabase.getCommentAndCreatorById(postId)
        if(!commentAndCreatorDB){
            throw new NotFoundError("Post não encontrado.")
     }

     const postDB: PostDB | undefined = await this.postDatabase.findPostById(postId)
     if(!postDB){
        throw new NotFoundError("Post não encontrado.")
     }

    if(payload.id === commentAndCreatorDB.creator_id){
        throw new ForbiddenError("Criador do post não pode dar Like ou Dislike no próprio post.")
    }

     const comment = new Comment(
        commentAndCreatorDB.id,
        commentAndCreatorDB.post_id,
        commentAndCreatorDB.content,
        commentAndCreatorDB.likes,
        commentAndCreatorDB.dislikes,
        commentAndCreatorDB.created_at,
        commentAndCreatorDB.updated_at,
        commentAndCreatorDB.creator_id,
        commentAndCreatorDB.creator_name
     )
    
        const likeSQlite = like ? 1: 0
    
        const likeDislikeCommentDB: LikeDislikeCommentDB = {
            user_id: payload.id,
            post_id: postId,
            comment_id: commentId,
            like: likeSQlite
        }
    
        const likeDislikeExists = await this.commentDatabase.findCommentLikeDislike(likeDislikeCommentDB)
        if(likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED){
            if(like){
                await this.commentDatabase.removeLikeDislike(likeDislikeCommentDB)
                comment.removeLike()
            }else{
                await this.commentDatabase.updateLikeDislike(likeDislikeCommentDB)
                comment.removeLike()
                comment.addDislike()
            }
        }else if(likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED){
            if(like === false){
                await this.commentDatabase.removeLikeDislike(likeDislikeCommentDB)
                comment.removeDislike()
            }else{
                await this.commentDatabase.updateLikeDislike(likeDislikeCommentDB)
                comment.removeDislike()
                comment.addLike()
            }
        }else{
            await  this.commentDatabase.insertLikeDislike(likeDislikeCommentDB)
            like ? comment.addLike() : comment.addDislike()
        }
        const updatedCommentDB = comment.toCommentDBModel()
        await this.commentDatabase.updateComment(updatedCommentDB)
    
        const output : LikeDislikeCommentOutputDTO = undefined
        return output
    }

}