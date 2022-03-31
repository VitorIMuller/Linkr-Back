import connection from "../database.js";

async function isFollowing(userId) {
  return connection.query(`
      SELECT
          id
      FROM
          follows f
      WHERE
          f."userId" = $1
  `, [userId])
}

export async function followStatus(userId, followedId) {
  return await connection.query(`
    SELECT * FROM follows
    WHERE "userId"=$1 AND "followedId"=$2
  `, [userId, followedId])
}

export async function follow(userId, followedId) {
  return await connection.query(`
    INSERT INTO follows ("userId", "followedId")
    VALUES ($1, $2)
  `, [userId, followedId])
}

export async function unfollow(followsId) {
  return await connection.query(`
    DELETE FROM follows WHERE follows.id = $1
  `, [followsId])
}

export const followsRepository = {
  isFollowing
}