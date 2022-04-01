import express from "express";
import { createPosts, deletePost, editPost, listPostByHashtag, listPostByUserId, listPosts, reposts } from "../Controllers/postsController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js"
import validateSchemaMiddleware from "../Middlewares/validateSchemaMiddleware.js";
import postSchema from "../Schemas/postSchema.js";

const postsRouter = express.Router();

postsRouter.use(validateTokenMiddleware);

postsRouter.get("/user/:userId", listPostByUserId);

postsRouter.post("/posts", validateSchemaMiddleware(postSchema), createPosts);
postsRouter.get("/posts/get/:limit/:offset", listPosts);
postsRouter.get("/posts/hashtag/:hashtag", listPostByHashtag);
postsRouter.post("/posts/reposts/:postId", reposts);
postsRouter.put("/posts/update/:postId", validateSchemaMiddleware(postSchema), editPost);
postsRouter.delete("/post/delete/:postId", deletePost);

export default postsRouter;