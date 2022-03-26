import connection from "../database.js";

async function allPosts(limit) {
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
        ORDER BY
            p.time DESC LIMIT $1
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
            u.image AS "profilePic"
        FROM 
            posts p
        LEFT JOIN users u
            ON p."userId" = $1
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
            hashtagpost ("postId", "hashtagId")
        VALUES ($1, $2)
    `, [parseInt(postId), parseInt(hashtagId)]);
}

<<<<<<< HEAD
async function getPostsByTag(hashtag) {
    const { rows: posts } = await connection.query(`
    SELECT users.id AS "userId", users.name, users.image, posts.*
        FROM posts
        JOIN hashtagPost ON hashtagPost."postId" = posts.id
        JOIN hashtags ON hashtags.id = hashtagPost."hashtagId"
        JOIN users ON users.id = posts."userId"
        WHERE hashtags.tag = $1
        ORDER BY posts.id DESC
        LIMIT 20
        
`, [hashtag])

    return posts
}



export const postsRepository = { allPosts, publishPost, postsByUserId, verifyExistingTag, insertHashtags, matchHashToPost, getPostsByTag }
=======
async function getPostsByHashtag(hashtag) {
    return connection.query(`
        SELECT 
            p.*,
            u.name AS username,
            u.image AS "profilePic"
        FROM
            posts p
        LEFT JOIN
            users u ON p."userId" = $1
        ORDER BY
            p.time DESC
    `, [hashtag]);
}

export const postsRepository = { allPosts, publishPost, postsByUserId, getPostsByHashtag, verifyExistingTag, insertHashtags, matchHashToPost }
>>>>>>> f35b58017f20615300a98a0daeedf2fea44361be
