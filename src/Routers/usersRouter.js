import express from "express";
import { getUser } from "../Controllers/usersController.js";
const usersRouter = express.Router();

usersRouter.get("/user", getUser);

export default usersRouter;