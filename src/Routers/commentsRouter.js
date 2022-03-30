import { Router } from "express";
import { commentsCounter, getComments, postComment } from "../Controllers/commentsController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js";


const commentsRouter = Router();
commentsRouter.use(validateTokenMiddleware);
commentsRouter.post("/comments", postComment);
commentsRouter.get("/comments/:postId", getComments)
commentsRouter.get("/comments/counter/:postId", commentsCounter)


export default commentsRouter;