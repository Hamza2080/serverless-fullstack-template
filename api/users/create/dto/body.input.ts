import * as Joi from '@hapi/joi';
import 'joi-extract-type';

export const CreateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    avatar: Joi.string().regex(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/).optional(),
}).required();

export type CreateUserSchema = Joi.extractType<typeof CreateUserSchema>;
