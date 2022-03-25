import connection from "../database.js";

async function insertLike(userId, postId) {
    return connection.query(`
        INSERT  INTO
            likes ("userId", "postId")
        VALUES 
            ($1, $2)
    `, [userId, postId]);
}

async function deleteLike(userId, postId) {
    return connection.query(`
        DELETE FROM 
            likes
        WHERE 
            "userId" = $1
            AND "postId" = $2
    ` [userId, postId]);
}

async function getPostTotalLikes(postId) {
    return connection.query(`
        SELECT
            COUNT(DISTINC "userId") AS total
        FROM
            likes
        WHERE
            "postId" = $1
    `, [postId]);
}

async function getUserLikes(userId, postId) {
    return connection.query(`
        SELECT
            *
        FROM
            likes
        WHERE
            "userId" = $1
            AND "postId" = $2
    `, [userId, postId]);
}

export const likeRepository = { insertLike, deleteLike, getPostTotalLikes, getUserLikes };