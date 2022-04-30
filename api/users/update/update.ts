import { validate } from '@hapi/joi';
import { Handler, APIGatewayEvent, Context } from 'aws-lambda'
import { dynamoDb } from '../../../util/dynamoHelper'
import { errorResponse, successResponse } from '../../../util/responseHelper';
import { UpdateUserSchema } from './dto/body.input';
import { HttpError, BadRequest } from 'http-errors';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { buildUpdateExpression } from '../../../util/updateExpression';
export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  try {
    const timestamp = new Date().getTime();
    if (!event.body) return errorResponse(400, { message: 'Body is required' });
    const data: UpdateUserSchema & { updated_at: number } = JSON.parse(event.body);

    if (!event.pathParameters?.id) {
      throw new BadRequest('Please provide a valid id');
    }
    validate(data, UpdateUserSchema);
    data.updated_at = timestamp;
    const params: DocumentClient.UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE as string,
      ...buildUpdateExpression({ user_id: event.pathParameters!.id }, data),
      ReturnValues: 'ALL_NEW'
    };
    // update the user in the database

    const res = await dynamoDb.update(params).promise()
    return successResponse(res.Attributes)
  } catch (error) {
    console.error(error)
    if (error instanceof HttpError) {
      return errorResponse(error.statusCode, { message: error.message });
    }
    return errorResponse(500, { message: 'Unable to process your request' });
  }
};