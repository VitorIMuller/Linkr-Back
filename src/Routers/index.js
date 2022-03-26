import { Router } from "express";
import authRouter from "./authRouter.js"
import postsRouter from "./postsRouter.js";
import trendingRouter from "./trendingRouter.js";

const router = Router();

router.use(authRouter);
router.use(postsRouter);
router.use(trendingRouter);

export default router;