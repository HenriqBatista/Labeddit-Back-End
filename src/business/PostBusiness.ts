import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { GetUsersOutputDTO } from "../dtos/getUsers.dto";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/post/getPosts.dto";
import { LikeDislikePostInputDTO, LikeDislikePostOutputDTO } from "../dtos/post/likeDislikePost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { LikeDislikeDB, POST_LIKE, Post } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";



export class PostBusiness{
    constructor(
        private postDatabase : PostDatabase,
        private userDatabase : UserDatabase,
        private idGenerator : IdGenerator,
        private tokenManager : TokenManager
        
    ){}

   public createPost = async (
    input: CreatePostInputDTO
   ):Promise<CreatePostOutputDTO>=>{
    const {content, token} = input

    const payload = this.tokenManager.getPayload(token)
    if(!payload){
        throw new BadRequestError("Token inválido")
    }
    const id = this.idGenerator.generate()
    const post = new Post(
        id,
        content,
        0,
        0,
        new Date().toISOString(),
        new Date().toISOString(),
        payload.id,
        payload.name
    )
    const postDB = post.toPostDBModel()
    await this.postDatabase.createPost(postDB)

    const output: CreatePostOutputDTO = undefined
    return output

   }

   public getPosts = async (
    input: GetPostInputDTO
   ):Promise<GetPostOutputDTO> =>{
    const {token} = input 
    const payload = this.tokenManager.getPayload(token)
    if(!payload){
        throw new BadRequestError("Token inválido")
    }

    const postsDBAndCreatorName = await this.postDatabase.findPostsAndCreatorName()

    const posts = postsDBAndCreatorName
    .map((postAndCreatorName)=>{
        const post = new Post(
        postAndCreatorName.id,
        postAndCreatorName.content,
        postAndCreatorName.likes,
        postAndCreatorName.dislikes,
        postAndCreatorName.created_at,
        postAndCreatorName.updated_at,
        postAndCreatorName.creator_id,
        postAndCreatorName.creator_name
        )

        return post.toPostBusinessModel()
    })
    const output: GetPostOutputDTO = posts
    return output
   }

   public editPost = async (
    input: EditPostInputDTO
   ):Promise<EditPostOutputDTO>=>{
    const {content, token, id} = input

    const payload = this.tokenManager.getPayload(token)
    if(!payload){
        throw new BadRequestError("Token inválido")
    }

    const postDB = await this.postDatabase.findPostById(id)

    if(!postDB){
        throw new NotFoundError("Esse Post não existe.")
    }
    if(payload.id !== postDB.creator_id){
        throw new BadRequestError("Somente o criador do Post pode editá-lo")
    }

    const post = new Post(
        postDB.id,
        postDB.content,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.updated_at,
        postDB.creator_id,
        payload.name
    )

    post.setContent(content)

    const updatedPostDB = post.toPostDBModel()
    await this.postDatabase.editPost(updatedPostDB)

    const output: EditPostOutputDTO = undefined
    return output

   }

   public deletePost = async (
    input: DeletePostInputDTO
   ):Promise<DeletePostOutputDTO>=>{
    const {token, idToDelete} = input

    const payload = this.tokenManager.getPayload(token)
    if(!payload){
        throw new BadRequestError("Token inválido")
    }

    const postDB = await this.postDatabase.findPostById(idToDelete)

    if(!postDB){
        throw new NotFoundError("Esse Post não existe.")
    }
    if(payload.role !== USER_ROLES.ADMIN){
        if(payload.id !== postDB.creator_id){
            throw new BadRequestError("Somente o criador do Post pode editá-lo")
        }}

    await this.postDatabase.deletePost(idToDelete)

    const output: DeletePostOutputDTO = undefined
    return output

   }

   public likeOrDislikePost = async (
    input: LikeDislikePostInputDTO
   ):Promise<LikeDislikePostOutputDTO>=>{
    const {token, postId, like} = input

    const payload = this.tokenManager.getPayload(token)
    if(!payload){
        throw new BadRequestError("Token inválido")
    }

    const postDBAndCreatorName = await this.postDatabase.findPostAndCreatorDBById(postId)
    if(!postDBAndCreatorName){
        throw new NotFoundError("Post não encontrado.")
 }
 const post = new Post(
    postDBAndCreatorName.id,
    postDBAndCreatorName.content,
    postDBAndCreatorName.likes,
    postDBAndCreatorName.dislikes,
    postDBAndCreatorName.created_at,
    postDBAndCreatorName.updated_at,
    postDBAndCreatorName.creator_id,
    postDBAndCreatorName.creator_name
 )

    const likeSQlite = like ? 1: 0

    const likeDislikeDB: LikeDislikeDB = {
        user_id: payload.id,
        post_id: postId,
        like: likeSQlite
    }

    const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislikeDB)
    if(likeDislikeExists === POST_LIKE.ALREADY_LIKED){
        if(like){
            await this.postDatabase.removeLikeDislike(likeDislikeDB)
            post.removeLike()
        }else{
            await this.postDatabase.updateLikeDislike(likeDislikeDB)
            post.removeLike()
            post.addDislikes()
        }
    }else if(likeDislikeExists === POST_LIKE.ALREADY_DISLIKED){
        if(like === false){
            await this.postDatabase.removeLikeDislike(likeDislikeDB)
            post.removeDislikes()
        }else{
            await this.postDatabase.updateLikeDislike(likeDislikeDB)
            post.removeDislikes()
            post.addLike()
        }
    }else{
        await  this.postDatabase.insertLikeDislike(likeDislikeDB)
        like ? post.addLike() : post.addDislikes()
    }
    const updatedPostDB = post.toPostDBModel()
    await this.postDatabase.editPost(updatedPostDB)

    const output : LikeDislikePostOutputDTO = undefined
    return output
}
}