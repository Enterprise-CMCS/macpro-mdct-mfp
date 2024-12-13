import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import { getBanner } from "../../storage/banners";
import { badRequest, noContent, ok } from "../../utils/responses/response-lib";

export const fetchBanner = handler(async (event, _context) => {
  const bannerId = event?.pathParameters?.bannerId;
  if (!bannerId) {
    return badRequest(error.NO_KEY);
  }
  const banner = await getBanner(bannerId);
  if (banner) {
    return ok(banner);
  }
  // Instead of 404, return 204 for silent error
  return noContent();
});
