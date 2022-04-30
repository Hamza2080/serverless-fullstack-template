import { Handler, APIGatewayEvent, Context } from 'aws-lambda'
import * as uuid from 'uuid'
import { dynamoDb } from '../../../util/dynamoHelper'
import { errorResponse, successResponse } from '../../../util/responseHelper'
import { HttpError } from 'http-errors';
import { CreateUserSchema } from './dto/body.input';
import validate from '../../../util/validateSchema';

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  // write the user to the database
  try {
    const timestamp = new Date().getTime()
    const data: CreateUserSchema = JSON.parse(event.body || '{}')
    validate(data, CreateUserSchema);

    const params = {
      TableName: process.env.DYNAMODB_TABLE as string,
      Item: {
        user_id: uuid.v1(),
        ...data,
        created_at: timestamp
      }
    };

    await dynamoDb.put(params).promise()
    return successResponse(params.Item);
  } catch (error) {
    if (error instanceof HttpError) {
      return errorResponse(error.statusCode, { message: error.message });
    }
    return errorResponse(500, { message: 'Unable to process your request' });
  }
}
