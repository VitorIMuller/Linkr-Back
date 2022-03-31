import { Router } from "express";
import authRouter from "./authRouter.js"
import likesRouter from "./likesRouter.js";
import postsRouter from "./postsRouter.js";
import trendingRouter from "./trendingRouter.js";
import followsRouter from "./followsRouter.js";
import commentsRouter from "./commentsRouter.js";
import usersRouter from "./usersRouter.js";

const router = Router();

router.use(authRouter);
router.use(postsRouter);
router.use(trendingRouter);
router.use(likesRouter);
router.use(followsRouter);
router.use(commentsRouter);
router.use(usersRouter);

export default router;