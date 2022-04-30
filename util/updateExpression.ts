import { BadRequest } from 'http-errors';
export const buildUpdateExpression = (
    keys: { [attributeKey: string]: any },
    payload: { [attributeKey: string]: any },
    existsCheck = true
): {
    Key: { [attributeKey: string]: string | number };
    UpdateExpression: string;
    ExpressionAttributeNames: { [attributeKey: string]: any };
    ExpressionAttributeValues: { [attributeKey: string]: any };
    ConditionExpression: any;
} => {
    let UpdateExpression = 'SET ';
    const ExpressionAttributeNames: any = {};
    const ExpressionAttributeValues: any = {};
    let ConditionExpression: any;
    const Key: any = {};

    Object.keys(keys).forEach((key) => {
        Key[`${key as string}`] = keys[key];

        if (existsCheck) {
            if (!ConditionExpression) ConditionExpression = `${key} = :${key}`;
            else ConditionExpression += ` and ${key} = :${key}`;
            ExpressionAttributeValues[`:${key}`] = keys[key];
        }
    });

    if (!Object.keys(payload).length) {
        throw new BadRequest('Please specify attributes to be updated');
    }

    Object.keys(payload).forEach((attribute, index) => {
        if (index === Object.keys(payload).length - 1) {
            UpdateExpression += `#${attribute} = :${attribute} `;
        } else {
            UpdateExpression += `#${attribute} = :${attribute}, `;
        }
        ExpressionAttributeNames[`#${attribute}`] = attribute;
        ExpressionAttributeValues[`:${attribute}`] = payload[attribute];
    });

    return {
        Key,
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ConditionExpression
    };
};
