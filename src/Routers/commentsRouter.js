import { Router } from "express";
import { postComment } from "../Controllers/commentsController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js";


const commentsRouter = Router();
commentsRouter.use(validateTokenMiddleware);
commentsRouter.post("/comments", postComment);


export default commentsRouter;