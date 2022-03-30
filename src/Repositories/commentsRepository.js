import connection from "../database.js";
export async function createComment(text, postId, userId) {
    return await connection.query(`
        INSERT INTO
            comments(text, "postId", "userId")
        VALUES ($1, $2, $3)
    `, [text, postId, userId]);
}
