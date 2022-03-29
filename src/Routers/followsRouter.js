import Router from 'express';
import { validateTokenMiddleware } from '../Middlewares/validateTokenMiddleware.js';
import { getFollowStatus, handleFollow } from '../Controllers/followsController.js';

const followsRouter = Router();

followsRouter.use(validateTokenMiddleware);

followsRouter.get('/follows/:loggedUser/:userToVerify', getFollowStatus);
followsRouter.post('/follows/:loggedUser/:userToHandle', handleFollow)

export default followsRouter;