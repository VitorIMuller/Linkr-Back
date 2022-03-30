import { createComment, listComments } from "../Repositories/commentsRepository.js";


export async function postComment(req, res) {
    const { text, postId, userId } = req.body
    console.log(userId)
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
    try {
        const comments = await listComments(id)


        return res.send(comments)
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500);
    }
}