import Joi from 'joi';

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  image: Joi.string().uri().required()
})

export default userSchema;