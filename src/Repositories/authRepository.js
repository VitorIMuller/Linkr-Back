import connection from "../database.js"

export async function verifyEmail(email) {
    return await connection.query(`
        SELECT * FROM users WHERE email=$1
    `, [email])
}

<<<<<<< HEAD
export async function createUser({ name, email, image }, passwordHash) {
=======
export async function createUser({name, email, image}, passwordHash) {
>>>>>>> 9e67f5d2d4a5eee8e4e5a22662d043ef585ae9f1
    return await connection.query(`
        INSERT INTO
            users(name, email, password, image)
        VALUES ($1, $2, $3, $4)
    `, [name, email, passwordHash, image]);
}

export async function createSession(user, token) {
    return await connection.query(`
        INSERT INTO
            sessions ("userId", token)
        VALUES ($1, $2)
    `, [user.id, token]);
}
