import express from "express";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js"
import validateSchemaMiddleware from "../Middlewares/validateSchemaMiddleware";
import postSchema from "../Schemas/postSchema";
import { createPosts } from "../Controllers/postsController.js";

const postsRouter = express.Router();

postsRouter.use(validateTokenMiddleware);

postsRouter.post('/posts', validateSchemaMiddleware(postSchema), createPosts);

export default postsRouter;