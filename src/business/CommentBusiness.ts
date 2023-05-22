import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comment/createComment.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Comment, CommentDB } from "../models/Comment";
import { Post, PostDB } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";


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

        return output
    }
}