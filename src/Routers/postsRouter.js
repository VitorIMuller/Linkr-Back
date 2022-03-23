import { Router } from "express";
import { listPosts } from "../Controllers/postsController.js";
import validateSchemaMiddleware from "../Middlewares/validateSchemaMiddleware.js";
import validateTokenMiddleware from "../Middlewares/validateTokenMiddleware.js";
import postSchema from "../Schemas/postSchema.js";

const postsRouter = Router();

postsRouter.post("/posts", $1, validateSchemaMiddleware(postSchema), $2) //só adicionar validateTokenMiddleware em $1 e função_cria_post em $2, Damon
postsRouter.get("/posts", listPosts);

export default postsRouter;