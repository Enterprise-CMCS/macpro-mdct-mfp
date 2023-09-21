import { createContext, ReactNode, useMemo, useEffect } from "react";
// utils
import { AdminBannerData, AdminBannerShape } from "types/banners";
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
// api
import { deleteBanner, getBanner, useStore, writeBanner } from "utils";

const ADMIN_BANNER_ID = bannerId;

export const AdminBannerContext = createContext<AdminBannerShape>({
  fetchAdminBanner: Function,
  writeAdminBanner: Function,
  deleteAdminBanner: Function,
});

export const AdminBannerProvider = ({ children }: Props) => {
  // state management
  const {
    bannerData,
    setBannerData,
    isBannerActive,
    setIsBannerActive,
    isBannerLoading,
    setIsBannerLoading,
    bannerErrorMessage,
    setBannerErrorMessage,
    isBannerDeleting,
    setIsBannerDeleting,
  } = useStore();

  const fetchAdminBanner = async () => {
    setIsBannerLoading(true);
    try {
      const currentBanner = await getBanner(ADMIN_BANNER_ID);
      const newBannerData = currentBanner?.Item || {};
      setBannerData(newBannerData);
      setBannerErrorMessage("");
    } catch (e: any) {
      // 404 expected when no current banner exists
      if (!e.toString().includes("404")) {
        setBannerErrorMessage(bannerErrors.GET_BANNER_FAILED);
      }
    }
    setIsBannerLoading(false);
  };

  const deleteAdminBanner = async () => {
    setIsBannerDeleting(true);
    try {
      await deleteBanner(ADMIN_BANNER_ID);
      await fetchAdminBanner();
    } catch (error: any) {
      setBannerErrorMessage(bannerErrors.DELETE_BANNER_FAILED);
    }
    setIsBannerDeleting(false);
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    try {
      await writeBanner(newBannerData);
    } catch (e: any) {
      setBannerErrorMessage(bannerErrors.CREATE_BANNER_FAILED);
    }
    await fetchAdminBanner();
  };

  useEffect(() => {
    fetchAdminBanner();
  }, []);

  const providerValue = useMemo(
    () => ({
      // Banner Data
      bannerData,
      setBannerData,
      // Banner showing
      isBannerActive,
      setIsBannerActive,
      // Banner Loading
      isBannerLoading,
      setIsBannerLoading,
      // Banner Error State
      bannerErrorMessage,
      setBannerErrorMessage,
      // Banner Deleting State
      isBannerDeleting,
      setIsBannerDeleting,
      // Banner API calls
      fetchAdminBanner,
      writeAdminBanner,
      deleteAdminBanner,
    }),
    [
      bannerData,
      isBannerActive,
      isBannerLoading,
      bannerErrorMessage,
      isBannerDeleting,
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
