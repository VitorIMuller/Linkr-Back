import { Router } from "express";
import { toggleLike, getTotalLikes, getLikes } from "../Controllers/likesController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js";

const likesRouter = Router();

likesRouter.use(validateTokenMiddleware);

likesRouter.post("/likes/toggle", toggleLike);
likesRouter.get("/likes/:postId/total", getTotalLikes);
likesRouter.get("/likes/:postId", getLikes);

export default likesRouter;