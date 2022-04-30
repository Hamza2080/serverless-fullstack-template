import { Handler, APIGatewayEvent, Context } from 'aws-lambda'
import { dynamoDb } from '../../../util/dynamoHelper'
import { errorResponse, successResponse } from '../../../util/responseHelper';

const params = {
  TableName: process.env.DYNAMODB_TABLE as string,
};

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  // fetch all users from the database
  try {
    const res = await dynamoDb.scan(params).promise()
    return successResponse(res.Items)
  } catch (error) {
    console.log(error);
    return errorResponse(501, { message: 'Unable to process your request' });
  }
};
