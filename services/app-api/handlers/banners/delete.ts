import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import { error } from "../../utils/constants/constants";
import { deleteBanner as deleteBannerById } from "../../storage/banners";
// types
import { UserRoles } from "../../utils/types";
import { badRequest, forbidden, ok } from "../../utils/responses/response-lib";

export const deleteBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return forbidden(error.UNAUTHORIZED);
  }
  if (!event?.pathParameters?.bannerId!) {
    return badRequest(error.NO_KEY);
  }
  const bannerId = event?.pathParameters?.bannerId!;
  await deleteBannerById(bannerId);
  return ok();
});
