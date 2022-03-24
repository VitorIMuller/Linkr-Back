import connection from '../database.js';


export async function createPosts(req, res) {

    const {link, description} = req.body;
    const userId = 1 // procurar como achar esse id pelo back;
    try {
        await connection.query(`
            INSERT INTO posts("userId", link, description)
                VALUES ($1, $2, $3)
        `, [userId, link, description]);
        res.sendStatus(201);
    } 
    catch (error) {       
        res.status(500).send(error);
    }
}