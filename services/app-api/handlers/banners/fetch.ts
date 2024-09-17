import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import { getBanner } from "../../storage/banners";
import { badRequest, ok } from "../../utils/responses/response-lib";

export const fetchBanner = handler(async (event, _context) => {
  if (!event?.pathParameters?.bannerId!) {
    return badRequest(error.NO_KEY);
  }
  const bannerId = event?.pathParameters?.bannerId!;
  const banner = await getBanner(bannerId);
  return ok(banner);
});
