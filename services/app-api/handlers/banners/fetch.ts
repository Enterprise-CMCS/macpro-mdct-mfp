import handler from "../handler-lib";
// utils
import { getBanners } from "../../storage/banners";
import { noContent, ok } from "../../utils/responses/response-lib";

export const fetchBanner = handler(async () => {
  const banner = await getBanners();

  if (banner) {
    return ok(banner);
  }
  // Instead of 404, return 204 for silent error
  return noContent();
});
