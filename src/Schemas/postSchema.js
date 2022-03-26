import joi from "joi";

const postSchema = joi.object({
    url: joi.string().uri().required(),
    userMessage: joi.string().allow('').optional(),
});

export default postSchema;