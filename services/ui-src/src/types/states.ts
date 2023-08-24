import { AdminBannerData, MFPUser } from "types";

// initial user state
export interface MfpUserState {
  // INITIAL STATE
  user: MFPUser | null;
  showLocalLogins: boolean | undefined;
  // ACTIONS
  setUser: (newUser: MFPUser | null) => void;
  setShowLocalLogins: (showLocalLogins: boolean) => void;
}

// initial admin banner state
export interface AdminBannerState {
  // INITIAL STATE
  bannerData: AdminBannerData | undefined;
  // ACTIONS
  setAdminBanner: (newBannerData: AdminBannerData | undefined) => void;
  clearAdminBanner: () => void;
}
