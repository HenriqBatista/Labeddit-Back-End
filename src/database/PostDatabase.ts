import { LikeDislikeDB, POST_LIKE, Post, PostDB, PostDBAndCreatorName } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase{
    public static POST_TABLE = "posts"
    public static LIKES_DISLIKES_TABLE = "likes_dislikes"
    

    public findPostsAndCreatorName = async ():Promise<PostDBAndCreatorName[]>=>{
       
        const result = await BaseDatabase
        .connection(PostDatabase.POST_TABLE)
        .select(
            `${PostDatabase.POST_TABLE}.id`,
            `${PostDatabase.POST_TABLE}.creator_id`,
            `${PostDatabase.POST_TABLE}.content`,
            `${PostDatabase.POST_TABLE}.likes`,
            `${PostDatabase.POST_TABLE}.dislikes`,
            `${PostDatabase.POST_TABLE}.created_at`,
            `${PostDatabase.POST_TABLE}.updated_at`,
            `${UserDatabase.TABLE_USERS}.name as creator_name`,
        )
        .join(`${UserDatabase.TABLE_USERS}`,`${PostDatabase.POST_TABLE}.creator_id`,"=",`${UserDatabase.TABLE_USERS}.id`)

        return result as PostDBAndCreatorName[];
    }

    public findPostById = async (
        id:string
        ):Promise<PostDB|undefined>=>{
        const [postDB] = await BaseDatabase.connection(PostDatabase.POST_TABLE).where({id:id})
        return postDB as PostDB|undefined
    }

    public createPost = async(postDB:PostDB
        )=>{
        await BaseDatabase.connection(PostDatabase.POST_TABLE).insert(postDB)

        return "Post criado com sucesso!"
    }

    public editPost = async (updatedPostDB:PostDB)=>{
        await BaseDatabase.connection(PostDatabase.POST_TABLE).update(updatedPostDB).where({id: updatedPostDB.id})

        return "Post editado com sucesso!"
    }

    public deletePost = async (id:string)=>{
        await BaseDatabase.connection(PostDatabase.POST_TABLE).del().where({id: id})

        return "Post excluido com sucesso!"
    }

    public findPostAndCreatorDBById = async (id:string):Promise<PostDBAndCreatorName| undefined>=>{
       
        const [result] = await BaseDatabase
        .connection(PostDatabase.POST_TABLE)
        .select(
            `${PostDatabase.POST_TABLE}.id`,
            `${PostDatabase.POST_TABLE}.creator_id`,
            `${PostDatabase.POST_TABLE}.content`,
            `${PostDatabase.POST_TABLE}.likes`,
            `${PostDatabase.POST_TABLE}.dislikes`,
            `${PostDatabase.POST_TABLE}.created_at`,
            `${PostDatabase.POST_TABLE}.updated_at`,
            `${UserDatabase.TABLE_USERS}.name as creator_name`,
        )
        .join(`${UserDatabase.TABLE_USERS}`,`${PostDatabase.POST_TABLE}.creator_id`,"=",`${UserDatabase.TABLE_USERS}.id`)
        .where({[`${PostDatabase.POST_TABLE}.id`]: id})

        return result as PostDBAndCreatorName | undefined;
    }
    
    public findLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ):Promise<POST_LIKE| undefined> => {

     const [result]:Array<LikeDislikeDB|undefined> = await BaseDatabase
     .connection(PostDatabase.LIKES_DISLIKES_TABLE)
     .select()
     .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
     })   
     if(result === undefined) {
        return undefined;
     }else if(result.like === 1){
        return POST_LIKE.ALREADY_LIKED
     }else{
        return POST_LIKE.ALREADY_DISLIKED
     }
    
    }

    public removeLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ):Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.LIKES_DISLIKES_TABLE)
        .delete()
        .where({
            user_id: likeDislikeDB.user_id,
            post_id: likeDislikeDB.post_id
        })
    }

    public updateLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ):Promise<void> =>{
        await BaseDatabase
        .connection(PostDatabase.LIKES_DISLIKES_TABLE)
        .update(likeDislikeDB)
        .where({
            user_id: likeDislikeDB.user_id,
            post_id: likeDislikeDB.post_id
        })
    }
    
    public insertLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
    ):Promise<void> =>{
        await BaseDatabase
        .connection(PostDatabase.LIKES_DISLIKES_TABLE)
        .insert(likeDislikeDB)
    }
}