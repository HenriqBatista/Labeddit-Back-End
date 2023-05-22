export interface CommentDB {
    id: string,
    post_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    creator_id: string,
}

export interface CommentAndCreatorNameDB {
    id: string,
    post_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    creator_id: string,
    creator_name: string
}

export interface CommentModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        username: string
    }
}


export interface LikeDislikeCommentDB {
    user_id: string,
    post_id: string,
    comment_id: string,
    like: number
}

export enum COMMENT_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
}



export class Comment {
    constructor(
      private id: string,
      private postId: string,
      private content: string,
      private likes: number,
      private dislikes: number,
      private createdAt: string,
      private updatedAt: string,
      private creatorId: string,
      private creatorName: string
    ) {}

    public getId(): string { return this.id; }
    public set(value: string) { this.id = value; }
    
    public getPostId(): string { return this.postId; }
    public setPostId(value: string) { this.postId = value; }

    public getCreatorId(): string { return this.creatorId; }
    public setCreatorId(value: string) { this.creatorId = value; }

    public getCreatorName(): string { return this.creatorName; }
    public setCreatorName(value: string) { this.creatorName = value; }

    public getContent(): string { return this.content; }
    public setContent(value: string) { this.content = value; }

    public getLikes(): number { return this.likes; }
    public setLikes(value: number) { this.likes = value; }

    public getDislikes(): number { return this.dislikes; }
    public setDislikes(value: number) { this.dislikes = value; }

    public getCreatedAt(): string { return this.createdAt; }
    public setCreatedAt(value: string) { this.createdAt = value; }

    public getUpdatedAt(): string { return this.updatedAt; }
    public setUpdatedAt(value: string) { this.updatedAt = value; }
    
    
    public addLike():void {
        this.likes ++
    }

    public removeLike():void {
        this.likes --
    }

    public addDislike():void {
        this.dislikes ++
    }

    public removeDislike():void {
        this.dislikes --
    }

    public toCommentDBModel():CommentDB{
        return{
        id: this.id,
        creator_id: this.creatorId,
        post_id: this.postId,
        content: this.content,
        likes: this.likes,
        dislikes: this.dislikes,
        created_at: this.createdAt,
        updated_at: this.updatedAt
        }
    }

    public toCommentBusinessModel(): CommentModel {
        return{
        id: this.id,
        content: this.content,
        likes: this.likes,
        dislikes: this.dislikes,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        creator:{
            id: this.creatorId,
            username: this.creatorName
        }
        }
    }

}
