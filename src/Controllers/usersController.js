import { usersRepository } from "../Repositories/usersRepository.js";

export async function searchUsers(req, res) {
    let { characters } = req.query;
    const minCharacters = 0;

    if (characters.length < minCharacters) return res.sendStatus(400);

    try {
        const { rows: users } = await usersRepository.searchUsersByName(characters);
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function searchFollows(req, res) {
    const { id: userId } = res.locals.user;
    let { characters } = req.query;
    const minCharacters = 0;

    if (characters.length < minCharacters) return res.sendStatus(400);

    try {
        const { rows: users } = await usersRepository.searchFollowed(userId, characters);
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function getUserInfo(req, res) {
    const { userId } = req.params;

    try {
        const { rows: user } = await usersRepository.getUserInfo(userId);

        res.send(user[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
