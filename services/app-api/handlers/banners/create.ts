import handler from "../handler-lib";
import { randomUUID } from "crypto";
// types
import { UserRoles } from "../../utils/types";
import { number, object, string } from "yup";
// utils
import { putBanner } from "../../storage/banners";
import { hasPermissions } from "../../utils/auth/authorization";
import { error } from "../../utils/constants/constants";
import { validateData } from "../../utils/validation/validation";
import {
  badRequest,
  created,
  forbidden,
  internalServerError,
} from "../../utils/responses/response-lib";

const validationSchema = object().shape({
  title: string().required(),
  description: string().required(),
  link: string().url().notRequired(),
  startDate: number().required(),
  endDate: number().required(),
});

export const createBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return forbidden(error.UNAUTHORIZED);
  }
  const unvalidatedPayload = JSON.parse(event.body!);

  let validatedPayload;
  try {
    validatedPayload = await validateData(validationSchema, unvalidatedPayload);
  } catch {
    return badRequest(error.INVALID_DATA);
  }

  const { title, description, link, startDate, endDate } = validatedPayload;
  const currentTime = Date.now();

  const newBanner = {
    key: randomUUID(),
    createdAt: currentTime,
    lastAltered: currentTime,
    lastAlteredBy: event?.headers["cognito-identity-id"],
    title,
    description,
    link,
    startDate,
    endDate,
  };
  try {
    await putBanner(newBanner);
  } catch {
    return internalServerError(error.DYNAMO_CREATION_ERROR);
  }
  return created(newBanner);
});
