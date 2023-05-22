import { COMMENT_LIKE, CommentAndCreatorNameDB, CommentDB, LikeDislikeCommentDB } from "../models/Comment";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";


export class CommentDatabase extends BaseDatabase{
    public static TABLE_USERS= "users"
    public static TABLE_COMMENTS = "comments_posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_comments"

    public async getCommentById(id:string): Promise<CommentDB|undefined> {
        const [result]: CommentDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .where({id:id})

        return result
    }

    public async getCommentAndCreatorById(id:string):Promise<CommentAndCreatorNameDB|undefined>{
        const [result]: CommentAndCreatorNameDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
            `${CommentDatabase.TABLE_COMMENTS}.id`,
                 `${CommentDatabase.TABLE_COMMENTS}.post_id`,
                 `${CommentDatabase.TABLE_COMMENTS}.content`,
                 `${CommentDatabase.TABLE_COMMENTS}.likes`,
                 `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
                 `${CommentDatabase.TABLE_COMMENTS}.created_at`,
                 `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
                 `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
                 `${UserDatabase.TABLE_USERS}.name AS creator_name`
        )
        .join(`${UserDatabase.TABLE_USERS}`,`${CommentDatabase.TABLE_COMMENTS}.creator_id`,"=",`${UserDatabase.TABLE_USERS}.id`)
        .where({[`${CommentDatabase.TABLE_COMMENTS}.id`]:id})

        return result
    }

    public async getCommentAndCreatorByPostId(id:string): Promise<CommentAndCreatorNameDB[]>{
        const result: CommentAndCreatorNameDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
            `${CommentDatabase.TABLE_COMMENTS}.id`,
                 `${CommentDatabase.TABLE_COMMENTS}.post_id`,
                 `${CommentDatabase.TABLE_COMMENTS}.content`,
                 `${CommentDatabase.TABLE_COMMENTS}.likes`,
                 `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
                 `${CommentDatabase.TABLE_COMMENTS}.created_at`,
                 `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
                 `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
                 `${UserDatabase.TABLE_USERS}.name AS creator_name`
        )
        .join(`${UserDatabase.TABLE_USERS}`, `${CommentDatabase.TABLE_COMMENTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)
        .where({[`${CommentDatabase.TABLE_COMMENTS}.post_id`]:id})

        return result
    }

    public async insertComment(newCommentDB: CommentDB):Promise<void> {
        await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .insert(newCommentDB)
    }

    public async updateComment(CommentDB: CommentDB): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
        .update(CommentDB)
        .where({id: CommentDB.id})
    }

    public async deleteCommentById(id: string): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
        .del()
        .where({id: id})
    }

    public async findCommentLikeDislike(likeDislikeCommentDB: LikeDislikeCommentDB): Promise<COMMENT_LIKE|undefined>{
        
        const [result]: LikeDislikeCommentDB[] | undefined = await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .where({
            user_id: likeDislikeCommentDB.user_id,
            comment_id: likeDislikeCommentDB.comment_id
        }) 
        if(result === undefined) {
            return undefined;
         }else if(result.like === 1){
            return COMMENT_LIKE.ALREADY_LIKED
         }else{
            return COMMENT_LIKE.ALREADY_DISLIKED
         }
    }

    public async findCommentLikeDislikeByUserId(id: string):Promise<LikeDislikeCommentDB[]>{
        const result: LikeDislikeCommentDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .where({user_id: id})

        return result
    }

    public removeLikeDislike = async (
        likeDislikeCommentDB: LikeDislikeCommentDB
    ):Promise<void> => {
        await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .delete()
        .where({
            user_id: likeDislikeCommentDB.user_id,
            comment_id: likeDislikeCommentDB.comment_id
        })
    }

    public updateLikeDislike = async (
        likeDislikeCommentDB: LikeDislikeCommentDB
    ):Promise<void> =>{
        await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .update(likeDislikeCommentDB)
        .where({
            user_id: likeDislikeCommentDB.user_id,
            comment_id: likeDislikeCommentDB.comment_id
        })
    }
    
    public insertLikeDislike = async (
        likeDislikeCommentDB: LikeDislikeCommentDB
    ):Promise<void> =>{
        await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .insert(likeDislikeCommentDB)
    }
}

