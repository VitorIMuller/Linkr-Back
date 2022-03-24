import connection from '../database.js';

export async function createPosts(req, res) {

    const {link, description} = req.body;
    const userId = res.locals.user;

    try {
        await connection.query(`
            INSERT INTO posts("userId", link, message)
                VALUES ($1, $2, $3)
        `, [userId, link, description]);
        res.sendStatus(201);
    } 
    catch (error) {       
        res.status(500).send(error);
    }
}