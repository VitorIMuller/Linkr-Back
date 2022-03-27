import { Router } from "express";
import { getTrending } from '../Controllers/trendingController.js'

const trendingRouter = Router();

trendingRouter.get('/trending/:limit', getTrending);

export default trendingRouter;