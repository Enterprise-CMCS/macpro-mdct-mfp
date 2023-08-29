import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// types
import {
  MfpUserState,
  MFPUser,
  AdminBannerData,
  AdminBannerState,
  ReportShape,
  MfpReportState,
  ReportMetadataShape,
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
  isBannerActive: false,
  // actions
  setAdminBanner: (newBanner: AdminBannerData | undefined) =>
    set(() => ({ bannerData: newBanner })),
  clearAdminBanner: () => set(() => ({ bannerData: undefined })),
  setIsBannerActive: (bannerStatus: boolean) =>
    set(() => ({ isBannerActive: bannerStatus })),
});

// REPORT STORE
const reportStore = (set: Function) => ({
  // initial state
  report: undefined,
  reportsByState: undefined,
  submittedReportsByState: undefined,
  // actions
  setReport: (newReport: ReportShape | undefined) =>
    set(() => ({ report: newReport })),
  setReportsByState: (newReportsByState: ReportMetadataShape[] | undefined) =>
    set(() => ({ reportsByState: newReportsByState })),
  clearReportsByState: () => set(() => ({ reportsByState: undefined })),
  setSubmittedReportsByState: (
    newSubmittedReportsByState: ReportMetadataShape[] | undefined
  ) => set(() => ({ submittedReportsByState: newSubmittedReportsByState })),
});

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<MfpUserState & AdminBannerState & MfpReportState>((set) => ({
      ...userStore(set),
      ...bannerStore(set),
      ...reportStore(set),
    })),
    {
      name: "mfp-store",
    }
  )
);
