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
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `, [userId, userMessage, url, urlTitle, urlDescription, urlImage]);
}

async function postsByUserId(userId) {
    return connection.query(`
        SELECT 
            p.*,
            u.name AS username,
            u.image AS "profilePic",
        FROM posts p
            LEFT JOIN users u ON p."userId" = $1
            ORDER BY p.time DESC
    `, [userId]);
}

async function verifyExistingTag(hashtag) {
    return connection.query(`
        SELECT * FROM hashtags WHERE tag=$1
    `, [hashtag]);
}

async function insertHashtags(tag) {
    return connection.query(`
        INSERT INTO
            hashtags (tag)
        VALUES ($1) RETURNING id
    `, [tag]);
}

async function matchHashToPost(postId, hashtagId) {
    return connection.query(`
        INSERT INTO
            hashtagpost ("postId", "hashtagId")
        VALUES ($1, $2)
    `, [parseInt(postId), parseInt(hashtagId)]);
}

async function getPostsByHashtag(hashtag) {
    return connection.query(`
        SELECT 
            p.*,
            u.name AS username,
            u.image AS "profilePic",
        FROM posts p
            LEFT JOIN users u ON p."userId" = $1
            ORDER BY p.time DESC
    `, [hashtag]);
}

export const postsRepository = { allPosts, publishPost, postsByUserId, getPostsByHashtag, verifyExistingTag , insertHashtags, matchHashToPost }
