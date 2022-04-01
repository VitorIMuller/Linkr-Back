import { postsRepository } from "../Repositories/postsRepository.js";
import urlMetadata from "url-metadata";
import { likeRepository } from "../Repositories/likeRepository.js";
import { hashtagRepository } from "../Repositories/trendingRepository.js";
import { deletePostComments } from "../Repositories/commentsRepository.js";

export async function listPosts(req, res) {
    const { limit } = req.params;
    const { offset } = req.params;
    const user = res.locals.user;

    try {
        const { rows: posts } = await postsRepository.allPosts(limit, user.id, offset);
        const { rows: repostsCount } = await postsRepository.repostCount();

        posts.forEach((post, index) => {
            repostsCount.forEach(repost => {
                if (repost.postId === post.id) {
                    posts[index] = { ...post, repostCount: repost.repostCount }
                }
            })
            if (!posts[index].repostCount) {
                posts[index] = { ...post, repostCount: 0 }
            }
        })

        res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function listReposts(req, res) {
    const { limit } = req.params;
    const { username } = req.body;

    try {
        const result = await postsRepository.allReposts(limit, username);

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function repostCount(req, res) {
    try {
        const result = await postsRepository.repostCount();

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function createPosts(req, res) {
    const { url, userMessage } = req.body;
    const user = res.locals.user;
    const userId = user.id;

    const pattern = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g;
    const words = userMessage.split(' ');
    const filteredHastags = words.filter(word => pattern.test(word));
    const hashtags = filteredHastags.map(tag => tag.split('#')[1]);

    try {
        const metadata = await urlMetadata(url);

        const urlTitle = metadata?.title;
        const urlDescription = metadata?.description;
        const urlImage = metadata?.image;

        const { rows: [postId] } = await postsRepository.publishPost(userId, userMessage, url, urlTitle, urlDescription, urlImage);

        hashtags.map(async tag => {
            const { rows: [hashtag] } = await postsRepository.verifyExistingTag(tag);

            if (!hashtag) {
                const { rows: [insertion] } = await postsRepository.insertHashtags(tag);
                await postsRepository.matchHashToPost(postId.id, insertion.id);
            } else {
                await postsRepository.matchHashToPost(postId.id, hashtag.id);
            }
        })

        res.sendStatus(201);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function listPostByUserId(req, res) {
    const { userId } = req.params;

    try {
        const { rows: posts } = await postsRepository.postsByUserId(userId);
        const { rows: repostsCount } = await postsRepository.repostCount();

        posts.forEach((post, index) => {
            repostsCount.forEach(repost => {
                if (repost.postId === post.id) {
                    posts[index] = { ...post, repostCount: repost.repostCount }
                }
            })
            if (!posts[index].repostCount) {
                posts[index] = { ...post, repostCount: 0 }
            }
        })

        res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function listPostByHashtag(req, res) {
    const { hashtag } = req.params;
    try {
        const posts = await postsRepository.getPostsByTag(hashtag);
        const { rows: repostsCount } = await postsRepository.repostCount();

        posts.forEach((post, index) => {
            repostsCount.forEach(repost => {
                if (repost.postId === post.id) {
                    posts[index] = { ...post, repostCount: repost.repostCount }
                }
            })
            if (!posts[index].repostCount) {
                posts[index] = { ...post, repostCount: 0 }
            }
        })

        res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function addHashtag(userMessage, postId) {
    const pattern = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g;
    const words = userMessage.split(' ');
    const filteredHastags = words.filter(word => pattern.test(word));
    const hashtags = filteredHastags.map(tag => tag.split('#')[1]);

    hashtags.map(async tag => {
        const { rows: [hashtag] } = await postsRepository.verifyExistingTag(tag);

        if (!hashtag) {
            const { rows: [insertion] } = await postsRepository.insertHashtags(tag);
            await postsRepository.matchHashToPost(postId, insertion.id);
        } else {
            await postsRepository.matchHashToPost(postId, hashtag.id);
        }
    })

}

export async function editPost(req, res) {
    const { postId } = req.params;
    const { url, userMessage } = req.body;
    const { id: userId } = res.locals.user;

    try {
        const { rows: data } = await postsRepository.searchUserId(postId);
        if (data[0].userId !== userId) return res.sendStatus(401);

        const result = await postsRepository.editPost(postId, userId, userMessage);
        addHashtag(userMessage, postId);
        res.status(200).send(result);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function deletePost(req, res) {
    const { postId } = req.params;

    try {
        await likeRepository.deletePostLike(postId);
        await hashtagRepository.deletePostHash(postId);
        await deletePostComments(postId);
        await postsRepository.deleteRepost(postId);
        await postsRepository.deletePost(postId);

        res.status(200).send("Post deleted");
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function searchUsers(req, res) {
    let { characters } = req.query;
    const minCharacters = 0;

    if (characters.length < minCharacters) return res.sendStatus(400);
    characters += '%';
    try {
        const { rows: users } = await postsRepository.searchUsersByName(characters);
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function reposts(req, res) {
    const user = res.locals.user;
    const userId = user.id;
    const { postId } = req.params;

    try {
        await postsRepository.reposts(userId, postId);

        res.status(200).send("Reposted");

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
