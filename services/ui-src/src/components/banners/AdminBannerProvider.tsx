import { createContext, ReactNode, useMemo, useEffect } from "react";
// utils
import { AdminBannerData, AdminBannerShape } from "types/banners";
import { bannerErrors } from "verbiage/errors";
// api
import {
  checkDateRangeStatus,
  deleteBanner,
  getBanners,
  useStore,
  writeBanner,
} from "utils";

export const AdminBannerContext = createContext<AdminBannerShape>({
  fetchAdminBanner: Function,
  fetchAllBanners: Function,
  writeAdminBanner: Function,
  deleteAdminBanner: Function,
});

export const AdminBannerProvider = ({ children }: Props) => {
  const { userIsAdmin } = useStore().user ?? {};

  // state management
  const {
    allBanners,
    setAllBanners,
    bannerData,
    setBannerData,
    bannerActive,
    setBannerActive,
    bannerLoading,
    setBannerLoading,
    bannerErrorMessage,
    setBannerErrorMessage,
    bannerDeleting,
    setBannerDeleting,
  } = useStore();

  const fetchAllBanners = async () => {
    setBannerLoading(true);
    try {
      const allBanners = await getBanners();
      // sort by latest creation date so the latest banner the admin creates shows up first
      allBanners.sort((a, b) => b.createdAt - a.createdAt);
      setAllBanners(allBanners);
    } catch {
      setBannerErrorMessage(bannerErrors.GET_BANNER_FAILED);
    } finally {
      setBannerLoading(false);
    }
  };

  const fetchAdminBanner = async () => {
    setBannerLoading(true);
    try {
      const currentBanners = await getBanners();
      // Find the most recent currently-active banner
      const currentBanner = currentBanners
        .sort((a, b) => b.createdAt - a.createdAt)
        .find((banner) =>
          checkDateRangeStatus(banner.startDate, banner.endDate)
        );
      setBannerData(currentBanner);
      setBannerErrorMessage(undefined);
    } catch (e: any) {
      // 404 expected when no current banner exists
      if (!e.toString().includes("404")) {
        setBannerErrorMessage(bannerErrors.GET_BANNER_FAILED);
      }
    }
    setBannerLoading(false);
  };

  const deleteAdminBanner = async (bannerKey: string) => {
    setBannerDeleting(true);
    try {
      await deleteBanner(bannerKey);
      await fetchAllBanners();
      await fetchAdminBanner();
    } catch {
      setBannerErrorMessage(bannerErrors.DELETE_BANNER_FAILED);
    }
    setBannerDeleting(false);
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    try {
      await writeBanner(newBannerData);
    } catch {
      setBannerErrorMessage(bannerErrors.CREATE_BANNER_FAILED);
    }
    await fetchAllBanners();
    await fetchAdminBanner();
  };

  useEffect(() => {
    let bannerActivity = false;
    if (bannerData) {
      bannerActivity = checkDateRangeStatus(
        bannerData.startDate,
        bannerData.endDate
      );
    }
    setBannerActive(bannerActivity);
  }, [bannerData]);

  useEffect(() => {
    fetchAdminBanner();
    if (userIsAdmin) {
      fetchAllBanners();
    }
  }, [userIsAdmin]);

  const providerValue = useMemo(
    () => ({
      // all banners
      allBanners,
      setAllBanners,
      // Banner Data
      bannerData,
      setBannerData,
      // Banner showing
      bannerActive,
      setBannerActive,
      // Banner Loading
      bannerLoading,
      setBannerLoading,
      // Banner Error State
      bannerErrorMessage,
      setBannerErrorMessage,
      // Banner Deleting State
      bannerDeleting,
      setBannerDeleting,
      // Banner API calls
      fetchAdminBanner,
      fetchAllBanners,
      writeAdminBanner,
      deleteAdminBanner,
    }),
    [
      allBanners,
      bannerData,
      bannerActive,
      bannerLoading,
      bannerErrorMessage,
      bannerDeleting,
    ]
  );

  return (
    <AdminBannerContext.Provider value={providerValue}>
      {children}
    </AdminBannerContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}
