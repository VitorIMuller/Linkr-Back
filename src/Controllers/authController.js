import bcrypt from 'bcrypt'
import { v4 as uuid } from "uuid"
import { createSession, createUser, verifyEmail } from '../Repositories/authRepository.js'

export async function signUp(req, res) {
  const user = req.body;

  try {
    const { rows: [existingEmail] } = await verifyEmail(user.email);

    if ( existingEmail ) {
        return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await createUser(user, passwordHash);

    return res.sendStatus(201);
  } catch (error) {
    console.log(error.message)
    return res.sendStatus(500);
  }
}

export async function signIn(req, res) {
    const { email, password } = req.body

    try {
      const { rows: [user] } = await verifyEmail(email);

      if ( !user ) {
        return res.sendStatus(401);
      }

      if ( bcrypt.compareSync(password, user.password)) {
        const token = uuid();
        await createSession(user, token);

        const { passwordHash, ...sendUser } = user;

        return res.status(200).send(...sendUser, token);
      }

      return res.sendStatus(401);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
}
