import Router from 'express';
import { validateTokenMiddleware } from '../Middlewares/validateTokenMiddleware.js';
import { getFollowStatus, handleFollow, isFollowing } from '../Controllers/followsController.js';

const followsRouter = Router();

followsRouter.use(validateTokenMiddleware);

followsRouter.get("/following/:userId", isFollowing);
followsRouter.get('/follows/:userToVerify', getFollowStatus);
followsRouter.post('/follows/:userToHandle', handleFollow);


export default followsRouter;