import { Router } from "express";
import { getComments, postComment } from "../Controllers/commentsController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js";


const commentsRouter = Router();
commentsRouter.use(validateTokenMiddleware);
commentsRouter.post("/comments", postComment);
commentsRouter.get("/comments/:postId", getComments)


export default commentsRouter;