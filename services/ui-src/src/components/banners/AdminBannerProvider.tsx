import { useState, createContext, ReactNode, useMemo, useEffect } from "react";
// types
import { AdminBannerData, AdminBannerShape } from "types/banners";
// utils
import { useStore } from "utils";
import { mockBannerData } from "utils/testing/mockBanner";
// verbiage
import { bannerErrors } from "verbiage/errors";

export const AdminBannerContext = createContext<AdminBannerShape>({
  fetchAdminBanner: Function,
  writeAdminBanner: Function,
  deleteAdminBanner: Function,
  isLoading: false as boolean,
  errorMessage: undefined,
});

export const AdminBannerProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // state management
  const { bannerData, setAdminBanner, clearAdminBanner } = useStore();

  const fetchAdminBanner = async () => {
    setIsLoading(true);
    try {
      setAdminBanner(mockBannerData);
    } catch (e: any) {
      setIsLoading(false);
      // 404 expected when no current banner exists
      if (!e.toString().includes("404")) {
        setError(bannerErrors.GET_BANNER_FAILED);
      }
    }
    setIsLoading(false);
  };

  const deleteAdminBanner = async () => {
    clearAdminBanner();
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    setAdminBanner(newBannerData);
  };

  useEffect(() => {
    fetchAdminBanner();
  }, []);

  const providerValue = useMemo(
    () => ({
      bannerData,
      fetchAdminBanner,
      writeAdminBanner,
      deleteAdminBanner,
      isLoading: isLoading,
      errorMessage: error,
    }),
    [bannerData, isLoading, error]
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
