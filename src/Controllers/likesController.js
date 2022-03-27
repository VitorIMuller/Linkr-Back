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
        const likes = await likeRepository.getPostTotalLikes(postId);

        if (likes.rowCount === 0) {
            return res.status(404).send("Post Not Found");
        }

        res.status(200).send(likes.rows[0].total);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

export async function getUsernamesLikes(req, res) {
    const { postId } = req.params;
    const userLocal = res.locals.user;

    try {
        const userLike = await likeRepository.getUserLikes(userLocal.id, postId);

        let userLocalLike = false;

        if (userLike.rowCount > 0) {
            userLocalLike = true;
        }

        const { rows: usersLikes } = await likeRepository.getPostUsernameLikes(postId, userLocal?.id);

        const { rows: like } = await likeRepository.getPostTotalLikes(postId);

        const [likes] = like;

        usersLikes.push({ ownUserLiked: userLocalLike, likes })

        res.status(200).send(usersLikes)
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