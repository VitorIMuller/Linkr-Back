import { Router } from "express";
import authRouter from "./authRouter.js"
import likesRouter from "./likesRouter.js";
import postsRouter from "./postsRouter.js";

const router = Router();

router.use(authRouter);
router.use(postsRouter);
router.use(likesRouter);

export default router;