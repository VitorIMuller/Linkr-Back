import joi from 'joi';

const postSchema = joi.object({
    link: joi.string().uri().required(),     
    description: joi.string().allow('').optional()
});

export default postSchema;