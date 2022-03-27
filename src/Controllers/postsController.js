import { postsRepository } from "../Repositories/postsRepository.js";
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

export async function listPostByHashtag(req, res) {
    const { hashtag } = req.params;
    try {
        const posts = await postsRepository.getPostsByTag(hashtag)

        if (posts.rowCount === 0) {
            return res.sendStatus(404);
        }
        res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function addHashtag (userMessage, postId){
    const pattern = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g;
    const words = userMessage.split(' ');
    const filteredHastags = words.filter( word => pattern.test(word ) );
    const hashtags = filteredHastags.map( tag => tag.split('#')[1] );

    hashtags.map(async tag => {
        const { rows: [hashtag] } = await postsRepository.verifyExistingTag(tag);
        
        if (!hashtag) {
            const { rows: [insertion]} = await postsRepository.insertHashtags(tag);
            await postsRepository.matchHashToPost(postId, insertion.id);
        } else {
            await postsRepository.matchHashToPost(postId, hashtag.id);
        }
    })

}

export async function editPost(req,res){
    const {postId} = req.params;
    const {url, userMessage} = req.body;
    const {id: userId} = res.locals.user;
    
    try {
        const {rows: data } = await postsRepository.searchUserId(postId);        
        if ( data[0].userId !== userId) return res.sendStatus(401);

        const result = await postsRepository.editPost(postId, userId, userMessage);
        addHashtag(userMessage,postId);   
        res.status(200).send(result);
        
    }catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}