import express from "express";
import { getUser } from "../Controllers/usersController.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js";
const usersRouter = express.Router();




usersRouter.get("/user", validateTokenMiddleware, getUser);

export default usersRouter;