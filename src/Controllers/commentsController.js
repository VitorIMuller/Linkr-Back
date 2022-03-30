import { createComment } from "../Repositories/commentsRepository.js";


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