import { useState, createContext, ReactNode, useMemo, useEffect } from "react";
// utils
import { AdminBannerData, AdminBannerShape } from "types/banners";
import { bannerErrors } from "verbiage/errors";

export const AdminBannerContext = createContext<AdminBannerShape>({
  bannerData: undefined as AdminBannerData | undefined,
  fetchAdminBanner: Function,
  writeAdminBanner: Function,
  deleteAdminBanner: Function,
  isLoading: false as boolean,
  errorMessage: undefined,
});

export const AdminBannerProvider = ({ children }: Props) => {
  const [bannerData, setBannerData] = useState<AdminBannerData | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const mockBannerData = {
    key: "mock-key",
    title: "mock-title",
    description: "mock-description",
    startDate: 0,
    endDate: 0,
    isActive: false,
  };

  const fetchAdminBanner = async () => {
    setIsLoading(true);
    try {
      setBannerData(mockBannerData);
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
    setBannerData(undefined);
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    setBannerData(newBannerData);
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
