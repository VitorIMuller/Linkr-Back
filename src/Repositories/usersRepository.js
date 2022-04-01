import connection from "../database.js";

async function searchUsersByName(characters) {
    characters += '%';
    return connection.query(`   
    SELECT id, name, image
    FROM users
        WHERE name ILIKE $1
    `, [characters]);
}

async function searchFollowed(userId, characters) {
    characters += '%';
    return connection.query(`   
    SELECT 	
	    f.id, f.name, f.image 
    FROM follows
        JOiN users u ON u.id=follows."userId"
        JOiN users f ON f.id=follows."followedId"
        WHERE u.id=$1 AND f.name ILIKE $2 ;
    `, [userId, characters]);
}

async function getUserInfo(userId) {
    return connection.query(`
        SELECT
            u.name,
            u.image
        FROM users u
        WHERE
            u.id = $1
    `, [userId]);
}

export const usersRepository = {
    searchUsersByName,
    searchFollowed,
    getUserInfo
} 
