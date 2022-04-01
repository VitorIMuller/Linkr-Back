import express from "express";
import { createPosts, deletePost, editPost, listPostByHashtag, listPostByUserId, listPosts, reposts, searchUsers } from "../Controllers/postsController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js"
import validateSchemaMiddleware from "../Middlewares/validateSchemaMiddleware.js";
import postSchema from "../Schemas/postSchema.js";

const postsRouter = express.Router();

postsRouter.use(validateTokenMiddleware);

postsRouter.get("/user/:userId", listPostByUserId);

postsRouter.post("/posts", validateSchemaMiddleware(postSchema), createPosts);
postsRouter.get("/posts/hashtag/:hashtag", listPostByHashtag);
postsRouter.get("/posts/:limit", listPosts);
postsRouter.put("/posts/:postId", validateSchemaMiddleware(postSchema), editPost);
postsRouter.delete("/post/delete/:postId", deletePost);
postsRouter.post("/posts/:postId/reposts", reposts);

export default postsRouter;