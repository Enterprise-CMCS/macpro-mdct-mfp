import handler from "../handler-lib";
// types
import { StatusCodes } from "../../utils/types";
// utils
import { error } from "../../utils/constants/constants";
import { getBanner } from "../../storage/banners";

export const fetchBanner = handler(async (event, _context) => {
  if (!event?.pathParameters?.bannerId!) {
    throw new Error(error.NO_KEY);
  }
  const bannerId = event?.pathParameters?.bannerId!;
  const banner = await getBanner(bannerId);
  return { status: StatusCodes.SUCCESS, body: banner };
});
