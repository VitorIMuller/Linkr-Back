import connection from "../database.js";

async function allPosts(limit, userId) {
    return connection.query(`
        SELECT
            p.*,
            u.name,
            u.image AS "profilePic"
        FROM
            posts p
        LEFT JOIN
            users u
                ON u.id = p."userId"
        LEFT JOIN
            follows f
                ON f."followedId" = p."userId"
        WHERE f."userId" = $1
        ORDER BY
            p.time DESC LIMIT $2
    `, [userId, limit]);
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
            u.image AS "profilePic"
        FROM 
            posts p
        LEFT JOIN users u
            ON p."userId" = u.id
        WHERE "userId"=$1
        ORDER BY
            p.time DESC
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
            "hashtagPost" ("postId", "hashtagId")
        VALUES ($1, $2)
    `, [parseInt(postId), parseInt(hashtagId)]);
}

async function getPostsByTag(hashtag) {
    const { rows: posts } = await connection.query(`
    SELECT users.id AS "userId", users.name, users.image, posts.*
        FROM posts
        JOIN "hashtagPost" ON "hashtagPost"."postId" = posts.id
        JOIN hashtags ON hashtags.id = "hashtagPost"."hashtagId"
        JOIN users ON users.id = posts."userId"
        WHERE hashtags.tag = $1
        ORDER BY posts.id DESC
        LIMIT 20
        
`, [hashtag])

    return posts
};

async function editPost(postId, userId, userMessage) {
    return connection.query(`   
    UPDATE posts
	    SET  "userMessage"=$1 
	    WHERE posts.id = $2 AND "userId"=$3
    `, [userMessage, postId, userId]);
}

async function searchUserId(postId) {
    return connection.query(`   
    SELECT 
	    posts."userId"
    FROM posts
	    WHERE posts.id=$1
    `, [postId]);
}

async function deletePost(postId) {
    return connection.query(`
        DELETE
        FROM
            posts
        WHERE
            id = $1
    `, [postId]);
}

async function searchUsersByName(characters) {
    return connection.query(`   
    SELECT id, name, image
    FROM users
        WHERE name ILIKE $1
    `, [characters]);
}

export const postsRepository = {
    allPosts,
    publishPost,
    postsByUserId,
    getPostsByTag,
    verifyExistingTag,
    insertHashtags,
    matchHashToPost,
    editPost,
    searchUserId,
    searchUsersByName,
    deletePost
}
