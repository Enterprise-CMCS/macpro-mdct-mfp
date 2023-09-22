import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import { error } from "../../utils/constants/constants";
// types
import { StatusCodes, UserRoles } from "../../utils/types";
import { number, object, string } from "yup";
import { validateData } from "../../utils/validation/validation";

export const createBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  } else if (!event?.pathParameters?.bannerId!) {
    throw new Error(error.NO_KEY);
  } else {
    const unvalidatedPayload = JSON.parse(event!.body!);

    const validationSchema = object().shape({
      key: string().required(),
      title: string().required(),
      description: string().required(),
      link: string().url().notRequired(),
      startDate: number().required(),
      endDate: number().required(),
    });

    const validatedPayload = await validateData(
      validationSchema,
      unvalidatedPayload
    );

    if (validatedPayload) {
      const params = {
        TableName: process.env.BANNER_TABLE_NAME!,
        Item: {
          key: event.pathParameters.bannerId,
          createdAt: Date.now(),
          lastAltered: Date.now(),
          lastAlteredBy: event?.headers["cognito-identity-id"],
          title: validatedPayload.title,
          description: validatedPayload.description,
          link: validatedPayload.link,
          startDate: validatedPayload.startDate,
          endDate: validatedPayload.endDate,
        },
      };
      await dynamoDb.put(params);
      return { status: StatusCodes.CREATED, body: params };
    }
  }
});
