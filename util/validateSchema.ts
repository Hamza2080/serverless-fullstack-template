import { ObjectSchema } from '@hapi/joi';
import { BadRequest } from 'http-errors';
/**
 * @description Generic Joi Validation
 * @param payload | Joi Schema
 */
export const validate = (payload: any, schema: any): void => {
  try {
    const result = schema.validate(payload || {});
    if (result.error) {
      throw new Error(result.error.details[0].message);
    }
  } catch (error) {
    throw new BadRequest((error as Error).message);
  }
};

export default validate;
