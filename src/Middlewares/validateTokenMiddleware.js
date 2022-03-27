import connection from "../database.js";

export async function validateTokenMiddleware(req, res, next) {

  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  const { rows: [session] } = await connection.query(`SELECT * FROM sessions WHERE token=$1`, [token]);
  if (!session) {
    return res.sendStatus(401);
  }

  const { rows: [user] } = await connection.query(`SELECT * FROM users WHERE id=$1`, [session.userId]);
  if (!user) {
    return res.sendStatus(401);
  }
  res.locals.user = user;
  next();
}