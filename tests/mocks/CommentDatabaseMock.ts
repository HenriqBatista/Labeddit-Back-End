import { BaseDatabase } from "../../src/database/BaseDatabase";
import {
  COMMENT_LIKE,
  CommentDB,
  CommentAndCreatorNameDB,
  LikeDislikeCommentDB,
} from "../../src/models/Comment";
import { UserDB } from "../../src/models/User";
import { usersMock } from "./UserDatabaseMock";

// export interface CommentDB {
//     id: string,
//     post_id: string,
//     content: string,
//     likes: number,
//     dislikes: number,
//     created_at: string,
//     updated_at: string,
//     creator_id: string,
// }

export const commentsMock: CommentDB[] = [
  {
    id: "c001",
    post_id: "p001",
    content: "comentário 1",
    likes: 0,
    dislikes: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_id: "id-mock-larissa",
  },
  {
    id: "c002",
    post_id: "p001",
    content: "comentário 2",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_id: "id-mock-henrique",
  },
  {
    id: "c003",
    post_id: "p002",
    content: "comentário 3",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_id: "id-mock-henrique",
  },
];
const LikeDislikeCommentMock: LikeDislikeCommentDB[] = [
  {
    user_id: "id-mock-henrique",
    post_id: "p001",
    comment_id: "c001",
    like: 1,
  },
  {
    user_id: "id-mock-larissa",
    post_id: "p001",
    comment_id: "c002",
    like: 0,
  },
  {
    user_id: "id-mock-larissa",
    post_id: "p002",
    comment_id: "c003",
    like: 1,
  },
];

export class CommentDatabaseMock extends BaseDatabase {
  
   public async getCommentById(id: string): Promise<CommentDB|undefined>{
    return commentsMock.filter((comment)=> comment.id === id)[0]
   } 
    
    
    public async getCommentAndCreatorById(
    id: string
  ): Promise<CommentAndCreatorNameDB | undefined> {
    switch (id) {
      case "c001":
        return {
          id: "c001",
          creator_id: "id-mock-larissa",
          creator_name: "larissa",
          content: "comentário 1",
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          post_id: "p001",
        };
      case "c002":
        return {
          id: "c002",
          creator_id: "id-mock-henrique",
          creator_name: "henrique",
          content: "comentário 2",
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          post_id: "p001",
        };
      case 'c003':
        return {
            id: "c003",
            creator_id: "id-mock-henrique",
            creator_name:"henrique",
            content: "comentário 3",
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            post_id: "p002",
        }
    }
  }

  public async getCommentAndCreatorByPostId(id:string):Promise<CommentAndCreatorNameDB[]>{
    switch(id){
        case "p001":
            return [
                {
                    id: "c001",
                    creator_id: "id-mock-larissa",
                    creator_name:"larissa",
                    content: "comentário 1",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    post_id: "p001",
                },
                  {
                    id: "c002",
                    creator_id: "id-mock-henrique",
                    creator_name:"henrique",
                    content: "comentário 2",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    post_id: "p001",
                  },
            ]
        case "p002":
            return [
                {
                    id: "c003",
                    creator_id: "id-mock-henrique",
                    creator_name: "henrique",
                    content: "comentário 3",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    post_id: "p002",
                  },
            ]
        default:
            return []
    }
  }

  public async insertComment(newCommentDB):Promise<void>{

  }

  public async updateComment(commentDB: CommentDB):Promise<void>{

  }

  public async deleteCommentById(id:string):Promise<void>{

  }

  public async findCommentLikeDislike(likeDislikeCommentDB: LikeDislikeCommentDB):Promise<COMMENT_LIKE | undefined>{

    const result: LikeDislikeCommentDB = LikeDislikeCommentMock.filter((LikeDislikeCommentMock)=>{
      likeDislikeCommentDB.user_id === LikeDislikeCommentMock.user_id && likeDislikeCommentDB.comment_id === LikeDislikeCommentMock.comment_id
    })[0]

    return result === undefined ? undefined : result && result.like === 1 ? COMMENT_LIKE.ALREADY_LIKED  : COMMENT_LIKE.ALREADY_DISLIKED

  }

  public async findCommentLikeDislikeByUserId(id:string):Promise<LikeDislikeCommentDB[]>{
    switch(id){
      case "id-mock-henrique":
        return [{
          user_id: "id-mock-henrique",
          post_id: "p001",
          comment_id: "c001",
          like: 1,
        }]

      case "id-mock-larissa":
        return [{
          
            user_id: "id-mock-larissa",
            post_id: "p001",
            comment_id: "c002",
            like: 0,
          },
          {
            user_id: "id-mock-larissa",
            post_id: "p002",
            comment_id: "c003",
            like: 1,
          }
        ]

        default:
          return []
    }
  }

  public removeLikeDislike = async (LikeDislikeCommentDB:LikeDislikeCommentDB):Promise <void> =>{

  }

  public updateLikeDislike = async(LikeDislikeCommentDB:LikeDislikeCommentDB):Promise<void> => {

  }

  public insertLikeDislike = async (LikeDislikeCommentDB:LikeDislikeCommentDB):Promise<void> => {}
}
