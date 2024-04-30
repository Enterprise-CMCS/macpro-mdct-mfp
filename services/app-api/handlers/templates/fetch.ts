import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import s3Lib from "../../utils/s3/s3-lib";
// types
import { StatusCodes, TemplateKeys } from "../../utils/types";

export const fetchTemplate = handler(async (event, _context) => {
  if (!event?.pathParameters?.templateName!) {
    throw new Error(error.NO_TEMPLATE_NAME);
  }
  let key;
  if (event.pathParameters.templateName === "WP") {
    key = TemplateKeys.WP;
  } else {
    throw new Error(error.INVALID_TEMPLATE_NAME);
  }
  // get the signed URL string
  const params = {
    Bucket: process.env.TEMPLATE_BUCKET!,
    Expires: 60,
    Key: key,
  };
  const url = await s3Lib.getSignedDownloadUrl(params);
  return { status: StatusCodes.SUCCESS, body: url };
});
