import connection from "../database.js";

async function allPosts(limit, userId, offset) {
    // async function allPosts(limit, userId) {
    //     return connection.query(`
    //         SELECT 
    //             p.*,
    //             u.name,
    //             u.image AS "profilePic",
    //             p.time AS "timestamp"
    //         FROM posts p
    //         JOIN users u
    //             ON u.id = p."userId"
    //         JOIN follows f
    //             ON f."followedId" = p."userId"
    //         WHERE f."userId" = $1

    //         LIMIT $2
    //     `, [userId, limit]);
    // }

    return connection.query(`
        SELECT  
            p.id, p."userMessage", p.url, p."userId", p."urlTitle", p."urlDescription", p."urlImage",
            r."createdAt" AS time,
            "postUser".name,
            "postUser".image AS "profilePic",
            "repostUser".name AS "repostedBy",
            "repostUser".id AS "repostedById"
        FROM reposts r
        JOIN posts p
            ON p.id = r."postId"
        JOIN users "postUser"
            ON "postUser".id = p."userId"
        JOIN users "repostUser"
            ON "repostUser".id = r."userId"
        WHERE r."userId" IN (
            SELECT
                f."followedId"
            FROM reposts r
            JOIN follows f
                ON f."followedId" = r."userId"
            WHERE
                f."userId" = $1 OR r."userId" = $1
        )
        UNION
        SELECT 
            p.id, p."userMessage", p.url, p."userId", p."urlTitle", p."urlDescription", p."urlImage",
	        p.time,
            u.name,
            u.image AS "profilePic",
            NULL,
            NULL
        FROM posts p
        LEFT JOIN users u
            ON u.id = p."userId"
        LEFT JOIN follows f
            ON f."followedId" = p."userId"
        WHERE f."userId" = $1
        ORDER BY time DESC
        LIMIT $2 
        OFFSET $3
    `, [userId, limit, offset]);
}

async function repostCount() {
    return connection.query(`
        SELECT
            r."postId",
            COUNT(r."postId") AS "repostCount"
        FROM
            reposts r
        GROUP BY
            r."postId"
    `);
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
        WHERE p."userId"=$1
        GROUP BY
            p.id, u.name, u.image
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
        GROUP BY
            posts.id, users.name, users.image, users.id
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

async function deleteRepost(postId) {
    return connection.query(`
        DELETE
        FROM
            reposts
        WHERE
            "postId" = $1
    `, [postId])
}

async function searchUsersByName(characters) {
    return connection.query(`   
    SELECT id, name, image
    FROM users
        WHERE name ILIKE $1
    `, [characters]);
}

async function reposts(userId, postId) {
    return connection.query(`
        INSERT INTO
            reposts ("userId", "postId")
        VALUES ($1, $2)
    `, [userId, postId]);
}

async function repostedAlready(userId, postId) {
    return connection.query(`
        SELECT
            *
        FROM reposts r
        WHERE
            r."userId" = $1
            AND r."postId" = $2
    `, [userId, postId]);
}

async function getPostTotalReposts(postId) {
    return connection.query(`
        SELECT
            COUNT(r."userId") AS total
        FROM
            reposts r
        WHERE
            "postId" = $1
    `, [postId]);
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
    deletePost,
    reposts,
    repostCount,
    deleteRepost,
    repostedAlready,
    getPostTotalReposts
}
