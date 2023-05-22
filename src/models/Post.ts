import { CommentAndCreatorNameDB, CommentModel } from "./Comment";

export interface PostDB {
    id: string;
    creator_id: string;
    comments: number;
    content: string;
    likes: number;
    dislikes: number;
    created_at: string;
    updated_at: string
}

export interface PostDBAndCreatorName {
    id: string;
    creator_id: string;
    comments: number;
    content: string;
    likes: number;
    dislikes: number;
    created_at: string;
    updated_at: string,
    creator_name: string
}

export interface PostModel{
    id: string;
    content: string;
    comments: number;
    likes: number;
    dislikes: number;
    createdAt: string;
    updatedAt: string
    creator:{
        id:string,
        name:string
    }
}

export interface PostAndCommentsDB{
    id:string;
    content:string;
    comments: number;
    likes: number;
    dislikes: number;
    created_at:string;
    updated_at:string;
    creator_name:string;
    comments_post: CommentAndCreatorNameDB[]
}

export interface PostAndCommentsModel{
    id:string;
    content:string;
    comments: number;
    likes: number;
    dislikes: number;
    createdAt:string;
    updatedAt:string;
    creator:{
        id:string;
        username:string;
    },
    commentsPost: CommentModel[]
}


export interface LikeDislikeDB {
    user_id: string;
    post_id: string;
    like: number;
}

export enum POST_LIKE {
    ALREADY_LIKED = "ALREDY_LIKED",
    ALREADY_DISLIKED = "ALREDY_DISLIKED"
}


export class Post {
    constructor(
        private id: string,
        private content: string,
        private comments: number,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string,
        private creatorId: string,
        private creatorName: string
        ){}

    public getId(): string { return this.id; }
    public set(value: string) { this.id = value; }

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

    public getComments(): number { return this.comments; }
    public setComments(value: number) { this.comments = value; }

    public getCreatedAt(): string { return this.createdAt; }
    public setCreatedAt(value: string) { this.createdAt = value; }

    public getUpdatedAt(): string { return this.updatedAt; }
    public setUpdatedAt(value: string) { this.updatedAt = value; }
    
    public addLike = () =>{
        this.likes ++
    }

    public removeLike = () =>{
        this.likes --
    }

    public addDislikes = () =>{
        this.dislikes ++
    }

    public removeDislikes = () =>{
        this.dislikes --
    }

    public toPostDBModel():PostDB{
        return{
        id: this.id,
        creator_id: this.creatorId,
        content: this.content,
        comments: this.comments,
        likes: this.likes,
        dislikes: this.dislikes,
        created_at: this.createdAt,
        updated_at: this.updatedAt
        }
    }

    public toPostBusinessModel(): PostModel {
        return{
        id: this.id,
        content: this.content,
        comments: this.comments,
        likes: this.likes,
        dislikes: this.dislikes,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        creator:{
            id: this.creatorId,
            name: this.creatorName
        }
        }
    }

    public toPostBusinessModelAndModel(commentsPost:CommentModel[]){
        return{
            id: this.id,
            content: this.comments,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator:{
                id: this.creatorId,
                name: this.creatorName
            },
            commentsPost: commentsPost
        }
    }
}