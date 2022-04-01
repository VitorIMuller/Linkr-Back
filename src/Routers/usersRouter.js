import express from "express";
import { getUserInfo, searchFollows, searchUsers } from "../Controllers/usersController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js";

const usersRouter = express.Router();

usersRouter.use(validateTokenMiddleware);

usersRouter.get("/users/search", searchUsers);
usersRouter.get("/users/follows", searchFollows);
usersRouter.get("/users/userInfo/:userId", getUserInfo);

export default usersRouter;

