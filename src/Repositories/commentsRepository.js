import connection from "../database.js";
export async function createComment(text, postId, userId) {
    return await connection.query(`
        INSERT INTO
            comments(text, "postId", "userId")
        VALUES ($1, $2, $3)
    `, [text, postId, userId]);
}
export async function listComments(id) {
    const { rows: comments } = await connection.query(`
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