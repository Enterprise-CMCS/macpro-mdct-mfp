import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import { error } from "../../utils/constants/constants";
// types
import { UserRoles } from "../../utils/types";
import { number, object, string } from "yup";
import { validateData } from "../../utils/validation/validation";
import { putBanner } from "../../storage/banners";
import {
  badRequest,
  created,
  forbidden,
} from "../../utils/responses/response-lib";

export const createBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return forbidden(error.UNAUTHORIZED);
  } else if (!event?.pathParameters?.bannerId!) {
    return badRequest(error.NO_KEY);
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

    if (!validatedPayload) {
      return badRequest(error.INVALID_DATA);
    }

    const newBanner = {
      key: event.pathParameters.bannerId,
      createdAt: Date.now(),
      lastAltered: Date.now(),
      lastAlteredBy: event?.headers["cognito-identity-id"],
      title: validatedPayload.title,
      description: validatedPayload.description,
      link: validatedPayload.link,
      startDate: validatedPayload.startDate,
      endDate: validatedPayload.endDate,
    };
    await putBanner(newBanner);
    return created(newBanner);
  }
});
