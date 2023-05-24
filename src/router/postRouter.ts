import  express  from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../database/UserDatabase";
import { PostDatabase } from "../database/PostDatabase";


export const postRouter = express.Router();

const postController = new PostController(
    new PostBusiness(
        new PostDatabase,
        new  UserDatabase,
        new  IdGenerator,
        new  TokenManager
    )
)

postRouter.post("/", postController.createPost)
postRouter.get("/", postController.getPosts)
postRouter.get("/:postId", postController.getPostsAndComments)
postRouter.put("/:id", postController.editPost)
postRouter.delete("/:id", postController.deletePost)
postRouter.put("/:id/like", postController.likeOrDislikePost)