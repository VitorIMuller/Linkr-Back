import { followStatus, follow, unfollow } from "../Repositories/followsRepository.js";

export async function getFollowStatus(req, res) {
  const loggedUserId = req.params['loggedUser'];
  const userToVerifyId = req.params['userToVerify'];

  try {
    if ( loggedUserId === userToVerifyId ) return res.send(false);

    const { rows: [follows] } = await followStatus(loggedUserId, userToVerifyId);

    if ( follows ) return res.send(true);

    return res.send(false);
    
  } catch (error) {
    console.log(error.message)
    return res.sendStatus(500);
  }
}

export async function handleFollow(req, res) {
  const loggedUserId = req.params['loggedUser'];
  const userToHandleId = req.params['userToHandle'];

  try {
    if ( loggedUserId === userToHandleId ) return res.sendStatus(409);

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