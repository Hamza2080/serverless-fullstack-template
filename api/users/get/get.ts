import { Handler, APIGatewayEvent, Context } from 'aws-lambda'
import { dynamoDb } from '../../../util/dynamoHelper'
import { NotFound, HttpError } from 'http-errors';
import { errorResponse, successResponse } from '../../../util/responseHelper';

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      user_id: event.pathParameters!.id,
    },
  };

  // fetch user from the database
  try {
    const res = await dynamoDb.get(params).promise();
    if (!res.Item) {
      throw new NotFound('User not found');
    }
    return successResponse(res.Item)
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError){
      return errorResponse(error.statusCode, { message: error.message });
    }
    return errorResponse(500, { message: 'Unable to process your request' });
  }
};