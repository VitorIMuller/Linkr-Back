import joi from "joi";

const postSchema = joi.string({
    link: joi.string().uri().required(),
    message: joi.string().required(),
});

export default postSchema;