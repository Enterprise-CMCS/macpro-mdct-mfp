// utils
import * as logger from "../utils/debugging/debug-lib";
import { isAuthorized } from "../utils/auth/authorization";
import { error, errorStatusMap } from "../utils/constants/constants";
import { sanitizeObject } from "../utils/sanitize/sanitize";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../utils/types";

type LambdaFunction = (
  event: APIGatewayProxyEvent, // eslint-disable-line no-unused-vars
  context: any // eslint-disable-line no-unused-vars
) => Promise<any>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, context: any) {
    // Start debugger
    logger.init();
    logger.debug("API event: %O", {
      body: event.body,
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
    });
    if (await isAuthorized(event)) {
      try {
        if (event.body) {
          const newEventBody = sanitizeObject(JSON.parse(event.body));
          event.body = JSON.stringify(newEventBody);
        }
        // Run the Lambda
        const { status, body } = await lambda(event, context);
        return buildResponse(status, body);
      } catch (error: any) {
        // Print debug messages
        logger.error("Error: %O", error);

        const body = { error: error.message };
        const status =
          errorStatusMap[error.message] ?? StatusCodes.SERVER_ERROR;
        return buildResponse(status, body);
      } finally {
        logger.flush();
      }
    } else {
      const body = { error: error.UNAUTHORIZED };
      return buildResponse(StatusCodes.UNAUTHORIZED, body);
    }
  };
}

function buildResponse(statusCode: number, body: any) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(body),
  };
}
