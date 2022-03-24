import { Router } from "express";
import { signIn, signUp } from "../Controllers/authController.js";
import validateSchemaMiddleware from "../Middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../Middlewares/validateTokenMiddleware.js";
import userSchema from "../Schemas/userSchema.js";

const authRouter = Router();

authRouter.post('/sign-up', validateSchemaMiddleware(userSchema), signUp);
authRouter.post('/sign-in', signIn);

export default authRouter;