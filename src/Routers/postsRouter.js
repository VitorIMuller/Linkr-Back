import express from "express";
import { createPosts, listPostByHashtag, listPostByUserId, listPosts } from "../Controllers/postsController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js"
import validateSchemaMiddleware from "../Middlewares/validateSchemaMiddleware.js";
import postSchema from "../Schemas/postSchema.js";

const postsRouter = express.Router();

postsRouter.use(validateTokenMiddleware);

postsRouter.post("/posts", validateSchemaMiddleware(postSchema), createPosts);
postsRouter.get("/posts/:limit", listPosts);
postsRouter.get("/user/:userId", listPostByUserId);
postsRouter.get("/posts/:hashtag", listPostByHashtag)

export default postsRouter;