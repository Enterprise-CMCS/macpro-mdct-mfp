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
  } = useStore();

  const fetchAdminBanner = async () => {
    setIsBannerLoading(true);
    try {
      const currentBanner = await getBanner(ADMIN_BANNER_ID);
      const newBannerData = currentBanner?.Item || {};
      setBannerData(newBannerData);
    } catch (e: any) {
      setIsBannerLoading(false);
      // 404 expected when no current banner exists
      if (!e.toString().includes("404")) {
        setBannerErrorMessage(bannerErrors.GET_BANNER_FAILED);
      }
    }
    setIsBannerLoading(false);
  };

  const deleteAdminBanner = async () => {
    await deleteBanner(ADMIN_BANNER_ID);
    setBannerData(undefined);
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    await writeBanner(newBannerData);
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
      // Banner API calls
      fetchAdminBanner,
      writeAdminBanner,
      deleteAdminBanner,
    }),
    [bannerData, isBannerActive, isBannerLoading, bannerErrorMessage]
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
