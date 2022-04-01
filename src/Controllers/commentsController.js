import { createComment, listComments, listFollows, numberComments } from "../Repositories/commentsRepository.js";


export async function postComment(req, res) {
    const { text, postId, userId } = req.body
    try {
        await createComment(text, postId, userId);
        return res.sendStatus(201);
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500);
    }
}

export async function getComments(req, res) {
    const id = req.params.postId
    const userId = res.locals.user
    try {
        const comments = await listComments(id, userId.id);
        res.send(comments)
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500);
    }
}

export async function commentsCounter(req, res) {
    const id = req.params.postId
    try {
        const comments = await numberComments(id)
        const counter = comments.toString()
        return res.status(200).send(counter);
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500);
    }
}