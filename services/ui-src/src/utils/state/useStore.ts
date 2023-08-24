import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// types
import {
  MfpUserState,
  MFPUser,
  AdminBannerData,
  AdminBannerState,
} from "types";

// USER STORE
const userStore = (set: Function) => ({
  // initial state
  user: null,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser: MFPUser | null) => set(() => ({ user: newUser })),
  // toggle show local logins (dev only)
  setShowLocalLogins: () => set(() => ({ showLocalLogins: true })),
});

// BANNER STORE
const bannerStore = (set: Function) => ({
  // initial state
  bannerData: undefined,
  // actions
  setAdminBanner: (newBanner: AdminBannerData | undefined) =>
    set(() => ({ bannerData: newBanner })),
  clearAdminBanner: () => set(() => ({ bannerData: undefined })),
});

// REPORT STORE
const reportStore = (set: Function) => ({});

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<MfpUserState & AdminBannerState>((set) => ({
      ...userStore(set),
      ...bannerStore(set),
      ...reportStore(set),
    })),
    {
      name: "mfp-store",
    }
  )
);
