import { Router } from "express";
import { signIn } from "../Controllers/signIn.js";

const signInRouter = Router();

signInRouter.post("/sign-in", signIn)

export default signInRouter