import { followStatus, verifyUser, follow, unfollow } from "../Repositories/followsRepository.js";

export async function getFollowStatus(req, res) {
  const loggedUserId = res.locals.user.id;
  const userToVerifyId = req.params['userToVerify'];

  try {
    if ( loggedUserId === userToVerifyId ) return res.send(false);

    const { rows: [userExists]} = await verifyUser(userToVerifyId);
    if(!userExists) return res.sendStatus(404);

    const { rows: [follows] } = await followStatus(loggedUserId, userToVerifyId);
    if ( follows ) return res.send(true);

    return res.send(false);
    
  } catch (error) {
    console.log(error.message)
    return res.sendStatus(500);
  }
}

export async function handleFollow(req, res) {
  const loggedUserId = res.locals.user.id;
  const userToHandleId = req.params['userToHandle'];

  try {
    if ( loggedUserId === userToHandleId ) return res.sendStatus(409);

    const { rows: [userExists]} = await verifyUser(userToHandleId);
    if(!userExists) return res.sendStatus(404);

    const { rows: [follows] } = await followStatus(loggedUserId, userToHandleId);

    if ( follows ) {
      await unfollow(follows.id);
      return res.send(`userId: ${loggedUserId} unfollowed userId: ${userToHandleId}`);
    }

    await follow(loggedUserId, userToHandleId);
    return res.send(`userId: ${loggedUserId} followed userId: ${userToHandleId}`);

  } catch (error) {
    console.log(error.message)
    return res.sendStatus(500);
  }
}