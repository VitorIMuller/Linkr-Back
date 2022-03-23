import connection from "../database";

async function allPosts(limit) {
    return connection.query(`
        SELECT 
            p.*,
            u.username,
            u.image AS "profilePic",
        FROM posts p
            LEFT JOIN users u ON u.id = p."userId"
        ORDER BY p.timestamp DESC
        LIMIT $1
    `, [limit])
}

export const postsRepository = { allPosts }