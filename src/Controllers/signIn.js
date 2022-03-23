import connection from "../database.js"
import bcrypt from 'bcrypt'
import { v4 as uuid } from "uuid"

export async function signIn(req, res) {
    const { email, password } = req.body

    try {
        console.log(email)
        const user = await connection.query(`SELECT * FROM users WHERE email=$1`, [email])
        if (user.rowCount === 0) return res.status(404).send("Email ou Senha não existem!")
        console.log("ok")

        const username = user.name
        if (bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            await connection.query(`INSERT INTO sessions (token, userId) VALUES ($1, $2)`, [token, user.id])
            res.status(200).send({ username, email, token })
        }

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500);
    }
}
