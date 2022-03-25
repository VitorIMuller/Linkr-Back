import { postsRepository } from "../Repositories/postsRepository.js";
import postsRouter from "../Routers/postsRouter.js";
import urlMetadata from "url-metadata";

export async function listPosts(req, res) {
    const { limit } = req.params;

    try {
        const result = await postsRepository.allPosts(limit);

        if (result.rowCount === 0) {
            return res.sendStatus(404);
        }

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function createPosts(req, res) {
    const { url, userMessage } = req.body;
    const user = res.locals.user;
    const userId = user.id;

    try {
        const metadata = await urlMetadata(url);

        const urlTitle = metadata?.title;
        const urlDescription = metadata?.description;
        const urlImage = metadata?.image;

        await postsRepository.publishPost(userId, userMessage, url, urlTitle, urlDescription, urlImage);

        res.sendStatus(201);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function listPostByUserId(req, res) {
    const { userId } = req.params;
    console.log(userId)

    try {
        const result = await postsRepository.postsByUserId(userId);

        if (result.rowCount === 0) {
            return res.sendStatus(404);
        }

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
