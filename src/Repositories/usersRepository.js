import connection from "../database.js";

export async function listUser(userId) {
    return connection.query(`
        SELECT 
            *
        FROM users
        WHERE id=$1
    `, [userId]);
}