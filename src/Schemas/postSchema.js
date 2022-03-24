import joi from "joi";

const postSchema = joi.object({
    url: joi.string().uri().required(),
    userMessage: joi.string().required(),
});

export default postSchema;