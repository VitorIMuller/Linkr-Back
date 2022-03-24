import connection from "../database.js"

export async function verifyEmail(email) {
    return await connection.query(`
        SELECT * FROM users WHERE email=$1
    `, [email])
}

export async function createUser({username, email, image}, passwordHash) {
    return await connection.query(`
        INSERT INTO
            users(username, email, password, image)
        VALUES ($1, $2, $3, $4)
    `, [username, email, passwordHash, image]);
}

export async function createSession(user, token) {
    return await connection.query(`
        INSERT INTO
            sessions ("userId", token)
        VALUES ($1, $2)
    `, [user.id, token]);
}
