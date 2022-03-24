import { postsRepository } from "../Repositories/postsRepository.js";
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
import connection from '../database.js';

export async function createPosts(req, res) {

    const { link, description } = req.body;
    const userId = res.locals.user;

    try {
        await connection.query(`
            INSERT INTO posts("userId", "userMessage", timestamp, url, urlTitle, urlDescription, urlImage)
                VALUES ($1, $2, $3)
        `, [userId, link, description]);
        res.sendStatus(201);
    }
    catch (error) {
        res.status(500).send(error);
    }
}
