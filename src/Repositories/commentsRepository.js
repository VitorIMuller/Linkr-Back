import connection from "../database.js";
export async function createComment(text, postId, userId) {
    return await connection.query(`
        INSERT INTO
            comments(text, "postId", "userId")
        VALUES ($1, $2, $3)
    `, [text, postId, userId]);
}
export async function listComments(id, userId) {
    const { rows: comments } = await connection.query(`
        SELECT 
            c.*, f."followedId" AS "followedId", u.name AS username, u.image AS image
            FROM
            comments c
            JOIN
            users u ON u.id= c."userId"
            LEFT JOIN follows f ON f."userId" = c."userId"
        WHERE
            "postId"=$1
    `, [parseInt(id)])
    return comments
}

export async function numberComments(id) {
    const { rowCount: comments } = await connection.query(`
        SELECT 
            u.name AS username, u.image AS image,
            c.*
            FROM
            comments c
            JOIN
            users u ON c."userId"= u.id
        WHERE
            "postId"=$1
    `, [id])
    return comments
}
export async function listFollows(id) {
    const { rows: follows } = await connection.query(`
        SELECT "followedId" FROM follows WHERE "userId" = $1
    `, [id])

    return follows
}
