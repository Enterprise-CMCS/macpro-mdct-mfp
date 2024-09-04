import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import { error } from "../../utils/constants/constants";
import { deleteBanner as deleteBannerById } from "../../storage/banners";
// types
import { StatusCodes, UserRoles } from "../../utils/types";

export const deleteBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  } else if (!event?.pathParameters?.bannerId!) {
    throw new Error(error.NO_KEY);
  } else {
    const bannerId = event?.pathParameters?.bannerId!;
    await deleteBannerById(bannerId);
    return { status: StatusCodes.SUCCESS, body: { Key: bannerId } };
  }
});
