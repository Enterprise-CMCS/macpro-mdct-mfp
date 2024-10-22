import { getRequestHeaders } from "./getRequestHeaders";
import { AdminBannerData } from "types/banners";
import { apiLib } from "utils";

async function getBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const path = `/banners/${bannerKey}`;

  return await apiLib.get(path, options);
}

async function writeBanner(bannerData: AdminBannerData) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: bannerData,
  };
  const path = `/banners/${bannerData.key}`;

  await apiLib.post(path, options);
}

async function deleteBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const path = `/banners/${bannerKey}`;

  await apiLib.del(path, options);
}

export { getBanner, writeBanner, deleteBanner };
