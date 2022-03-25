import { listUser } from "../Repositories/usersRepository.js"

export async function getUser(req, res) {
    const { userId } = req.body;
    console.log(userId)

    try {
        const result = await listUser(userId);

        if (result.rowCount === 0) {
            return res.sendStatus(404);
        }

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

