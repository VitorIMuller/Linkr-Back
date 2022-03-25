import connection from "../database.js";

async function allPosts(limit) {
    return connection.query(`
        SELECT 
            p.*,
            u.name,
            u.image AS "profilePic"
        FROM posts p
            LEFT JOIN users u ON u.id = p."userId"
        ORDER BY p.time DESC
        LIMIT $1
    `, [limit]);
}

async function publishPost(userId, userMessage, url, urlTitle, urlDescription, urlImage) {
    return connection.query(`   
    INSERT INTO
        posts ("userId", "userMessage", url, "urlTitle", "urlDescription", "urlImage")
    VALUES ($1, $2, $3, $4, $5, $6)
    `, [userId, userMessage, url, urlTitle, urlDescription, urlImage]);
}

export const postsRepository = { allPosts, publishPost }