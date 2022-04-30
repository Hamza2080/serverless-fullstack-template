import * as Joi from '@hapi/joi';
import 'joi-extract-type';

export const UpdateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    avatar: Joi.string().regex(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/).optional(),
}).required();

export type UpdateUserSchema = Joi.extractType<typeof UpdateUserSchema>;
