import express from "express";
import validateSchemaMiddleware from "../Middlewares/validateSchemaMiddleware";
import postSchema from "../Schemas/postSchema";

const postsRouter = express.Router();

postsRouter.post('/post', validateSchemaMiddleware(postSchema))

export default postsRouter;