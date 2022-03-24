import { postsRepository } from "../Repositories/postsRepository.js";
import connection from '../database.js';
//import urlMetadata from "url-metadata";

export async function listPosts(req, res) {
    const { limit } = req.params;

    try {
        const result = await postsRepository.allPosts(limit);

        if (result.rowCount === 0) {
            return res.status(404);
        }

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function createPosts(req, res) {

    const { link, description } = req.body;
    const user = res.locals.user;

    try {
        await connection.query(`
            INSERT INTO posts("userId", "userMessage", timestamp, url, urlTitle, urlDescription, urlImage)
                VALUES ($1, $2, $3)
        `, [user.id, link, description]);
        res.sendStatus(201);
    }
    catch (error) {
        res.status(500).send(error);
    }
}
