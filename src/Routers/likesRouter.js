import { Router } from "express";
import { toggleLike, getTotalLikes, getLikes } from "../Controllers/likesController";

const likeRouter = Router();

likeRouter.post("/like/toggle", toggleLike);
likeRouter.get("/like/:postId/total", getTotalLikes);
likeRouter.get("/like/:postId", getLikes);

export default likeRouter;