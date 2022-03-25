import express from "express";
import { getUser } from "../Controllers/usersController.js";
const usersRouter = express.Router();

usersRouter.get("/users", getUser);

export default usersRouter;