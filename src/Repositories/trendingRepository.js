import connection from "../database.js"

export async function trending(limit) {
  return await connection.query(`
    SELECT hashtags.tag AS hashtag, COUNT("hashtagId") AS frequency FROM "hashtagPost" 
      JOIN hashtags ON "hashtagId"=hashtags.id 
      JOIN posts ON "postId"=posts.id 
    WHERE posts.time > now() - interval '1 day' 
    GROUP BY hashtags.tag
    ORDER BY frequency DESC
    LIMIT $1
  `, [limit]);
}

async function deletePostHash(postId) {
  return connection.query(`
        DELETE
        FROM
            "hashtagPost"
        WHERE
            "postId" = $1
    `, [postId]);
}

export const hashtagRepository = {
  deletePostHash
};