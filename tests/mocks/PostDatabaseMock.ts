import {
  LikeDislikeDB,
  POST_LIKE,
  PostDB,
  PostAndCommentsDB,
  PostDBAndCreatorName,
} from "../../src/models/Post";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { usersMock } from "./UserDatabaseMock";
import { UserDB } from "../../src/models/User";
import { CommentDB, CommentAndCreatorNameDB } from "../../src/models/Comment";
import { commentsMock } from "./CommentDatabaseMock";

// export interface PostDB {
//     id: string;
//     creator_id: string;
//     comments: number;
//     content: string;
//     likes: number;
//     dislikes: number;
//     created_at: string;
//     updated_at: string
// }

const postsMock: PostDB[] = [
  {
    id: "p001",
    creator_id: "id-mock-henrique",
    comments: 0,
    content: "post 1",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p002",
    creator_id: "id-mock-larissa",
    comments: 0,
    content: "post 2",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p003",
    creator_id: "id-mock-henrique",
    comments: 0,
    content: "post 3",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const likeDislikesPostMock: LikeDislikeDB[] = [
  {
    user_id: "id-mock-henrique",
    post_id: "p002",
    like: 1,
  },
  {
    user_id: "id-mock-larissa",
    post_id: "p001",
    like: 0,
  },
];

export class PostDatabaseMock extends BaseDatabase {
  public findPostsAndCreatorName = async ():Promise<PostDBAndCreatorName[]> => {
    const postAndCreatorName: PostDBAndCreatorName[] = postsMock.map(
      (postMock) => {
        const user: UserDB = usersMock.filter(
          (user) => user.id === postMock.creator_id
        )[0];

        const post: PostDBAndCreatorName = {
          ...postMock,
          creator_name: user.name,
        };
        return post;
      }
      );
      return postAndCreatorName
  };

  public async findPostById(id: string): Promise<PostDB | undefined> {
    return postsMock.filter((post) => post.id === id)[0];
  }

  public async findPostAndCreatorDBById(
    id: string
  ): Promise<PostDBAndCreatorName | undefined> {
    switch (id) {
      case "p001":
        return {
          id: "p001",
          creator_id: "id-mock-henrique",
          comments: 0,
          content: "post 1",
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator_name: "henrique",
        };
      case "p002":
        return {
          id: "p002",
          creator_id: "id-mock-larissa",
          comments: 0,
          content: "post 2",
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator_name: "larissa",
        };
      case "p003":
        return {
          id: "p002",
          creator_id: "id-mock-henrique",
          comments: 0,
          content: "post 3",
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator_name: "larissa",
        };

      default:
        return undefined;
    }
  }

  public async findPostAndCommentsById(id:string):Promise<PostAndCommentsDB|undefined>{
    switch (id) {
        case 'p001':
            return {
                id: "p001",
                creator_id: "id-mock-henrique",
                comments: 0,
                content: "post 1",
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator_name: "henrique",
                comments_post: [
                    {
                        id: "c001",
                        post_id: "p001",
                        content: "comentário 1",
                        likes: 0,
                        dislikes: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        creator_id: "id-mock-larissa",
                        creator_name: "larissa"
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
                        creator_name: "henrique"
                      }
                ]
            }
        case 'p002':
            return {
                id: "p002",
                creator_id: "id-mock-larissa",
                comments: 0,
                content: "post 2",
                likes: 1,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator_name: "larissa",
                comments_post: [
                    {
                        id: "c003",
                        post_id: "p002",
                        content: "comentário 3",
                        likes: 0,
                        dislikes: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        creator_id: "id-mock-henrique",
                        creator_name: "henrique"
                      }
                ]
            }
        default: 
        return undefined
    }
  }

  public async createPost(postDB: PostDB):Promise<void>{

  }

  public async editPost(postDB: PostDB): Promise<void>{

  }

  public async deletePost(id:string): Promise<void>{

  }

  public findLikeDislike = async (likeDislikeDB:LikeDislikeDB):Promise<POST_LIKE| undefined>=>{
    switch (likeDislikeDB.user_id && likeDislikeDB.post_id){
      case "id-mock-henrique" && "p002":
        return POST_LIKE.ALREADY_LIKED
      case "id-mock-larissa" && "p001":
      return POST_LIKE.ALREADY_DISLIKED
      default: return undefined
    }
  }

  public async getLikeDislikeFromPostById (likeDislikeDB: LikeDislikeDB):Promise<POST_LIKE | undefined> {

    const result:LikeDislikeDB = likeDislikesPostMock.filter((likeDislikePostMock) => {
        likeDislikeDB.user_id === likeDislikePostMock.user_id && likeDislikeDB.post_id === likeDislikePostMock.post_id
    })[0]

    return result === undefined ?  undefined : result && result.like === 1 ? POST_LIKE.ALREADY_LIKED : POST_LIKE.ALREADY_DISLIKED
}


    public removeLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void>=>{}

    public updateLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void>=>{}

    public insertLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void>=>{}

}
