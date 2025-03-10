import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import { getTemplateDownloadUrl } from "../../storage/templates";
// types
import { TemplateKeys } from "../../utils/types";
import { badRequest, ok } from "../../utils/responses/response-lib";

/*
 * NOTE: This handler is not concerned with _form_ templates, like wp.json!
 *
 * It is exclusively for user-oriented help files:
 * static downloads which users may refer to as "templates".
 */

export const fetchTemplate = handler(async (event, _context) => {
  if (!event?.pathParameters?.templateName!) {
    return badRequest(error.NO_TEMPLATE_NAME);
  }
  let key: TemplateKeys | undefined;
  if (event.pathParameters.templateName === "WP") {
    key = TemplateKeys.WP;
  } else if (event.pathParameters.templateName === "SAR") {
    key = TemplateKeys.SAR;
  } else {
    return badRequest(error.INVALID_TEMPLATE_NAME);
  }
  const url = await getTemplateDownloadUrl(key);
  return ok(url);
});
