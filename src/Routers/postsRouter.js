import express from "express";
import { createPosts, deletePost, editPost, listPostByHashtag, listPostByUserId, listPosts, searchUsers } from "../Controllers/postsController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js"
import validateSchemaMiddleware from "../Middlewares/validateSchemaMiddleware.js";
import postSchema from "../Schemas/postSchema.js";

const postsRouter = express.Router();

postsRouter.use(validateTokenMiddleware);

postsRouter.post("/posts", validateSchemaMiddleware(postSchema), createPosts);
postsRouter.get("/posts/:limit", listPosts);
postsRouter.get("/user/:userId", listPostByUserId);
postsRouter.get("/posts/hashtag/:hashtag", listPostByHashtag);
postsRouter.put("/posts/:postId", validateSchemaMiddleware(postSchema), editPost);
postsRouter.delete("/post/delete/:postId", deletePost);
postsRouter.get("/users/search", searchUsers);

export default postsRouter;