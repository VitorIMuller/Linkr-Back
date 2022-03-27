import { Router } from "express";
import { toggleLike, getTotalLikes, getLikes, getUsernamesLikes } from "../Controllers/likesController.js";

const likesRouter = Router();

likesRouter.post("/likes/toggle", toggleLike);
likesRouter.get("/likes/:postId/total", getTotalLikes);
likesRouter.get("/likes/:postId", getLikes);
likesRouter.get("/likes/:postId/usernames", getUsernamesLikes)

export default likesRouter;