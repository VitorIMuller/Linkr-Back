import { verifyId } from "../Repositories/authRepository.js";
import { likeRepository } from "../Repositories/likeRepository.js";

export async function toggleLike(req, res) {
    const { like, postId } = req.body;
    const userLocal = res.locals.user;

    try {

        const user = await verifyId(userLocal.id);

        if (user.rowCount === 0) {
            return res.status(404).send("User Not Found");
        }

        if (!like) {
            await likeRepository.insertLike(user.rows[0].id, postId);
        } else {
            await likeRepository.deleteLike(user.rows[0].id, postId);
        }

        return res.status(200).send(!like);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

export async function getTotalLikes(req, res) {
    const { postId } = req.params;

    try {
        const post = await likeRepository.getPostTotalLikes(postId);

        if (post.rowCount === 0) {
            return res.status(404).send("Post Not Found");
        }

        const postTotalLikes = post.rows[0].total;

        res.status(200).send(postTotalLikes);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

export async function getLikes(req, res) {
    const { postId } = req.params;
    const userLocal = res.locals.user;

    try {
        const user = await verifyId(userLocal.id);

        if (user.rowCount === 0) {
            return res.status(404).send("User Not Found");
        }

        const likes = await likeRepository.getUserLikes(user.rows[0].id, postId);

        if (likes.rowCount === 0) {
            return res.status(200).send(false);
        } else {
            return res.status(200).send(true);
        }
    } catch (error) {
        console.log(error);
        return req.status(500).send(error);
    }
}