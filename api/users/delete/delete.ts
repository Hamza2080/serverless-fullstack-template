import { Handler, APIGatewayEvent, Context } from 'aws-lambda'
import { dynamoDb } from '../../../util/dynamoHelper'
import { errorResponse, successResponse } from '../../../util/responseHelper';
import { HttpError, BadRequest, NotFound } from 'http-errors';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  try {
    const userId = event.pathParameters?.id;
    if (!userId) {
      throw new BadRequest('Please provide a valid id');
    }

    const params: DocumentClient.DeleteItemInput = {
      TableName: process.env.DYNAMODB_TABLE as string,
      Key: {
        user_id: userId
      }
    };
    // update the user in the database
    const getres = await dynamoDb.get(params).promise();
    if(!getres.Item) {
      throw new NotFound('The user does not exist');
    }

    const res = await dynamoDb.update(params).promise()
    return successResponse({message: 'User deleted'});
  } catch (error) {
    console.error(error)
    if (error instanceof HttpError) {
      return errorResponse(error.statusCode, { message: error.message });
    }
    return errorResponse(500, { message: 'Unable to process your request' });
  }
};