export function successResponse(payload: any) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  }
}

export function errorResponse(errorCode: number, message: object) {
  return {
    statusCode: errorCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message)
  }
}