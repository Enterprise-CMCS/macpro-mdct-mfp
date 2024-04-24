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
  EntityShape,
  MfpEntityState,
  ErrorVerbiage,
} from "types";

// USER STORE
const userStore = (set: Function) => ({
  // initial state
  user: undefined,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser?: MFPUser) =>
    set(() => ({ user: newUser }), false, { type: "setUser" }),
  // toggle show local logins (dev only)
  setShowLocalLogins: () =>
    set(() => ({ showLocalLogins: true }), false, { type: "showLocalLogins" }),
});

// BANNER STORE
const bannerStore = (set: Function) => ({
  // initial state
  bannerData: undefined,
  bannerActive: false,
  bannerLoading: false,
  bannerErrorMessage: undefined,
  bannerDeleting: false,
  // actions
  setBannerData: (newBanner: AdminBannerData | undefined) =>
    set(() => ({ bannerData: newBanner }), false, { type: "setBannerData" }),
  clearAdminBanner: () =>
    set(() => ({ bannerData: undefined }), false, { type: "clearAdminBanner" }),
  setBannerActive: (bannerStatus: boolean) =>
    set(() => ({ bannerActive: bannerStatus }), false, {
      type: "setBannerActive",
    }),
  setBannerLoading: (loading: boolean) =>
    set(() => ({ bannerLoading: loading }), false, {
      type: "setBannerLoading",
    }),
  setBannerErrorMessage: (errorMessage: ErrorVerbiage | undefined) =>
    set(() => ({ bannerErrorMessage: errorMessage }), false, {
      type: "setBannerErrorMessage",
    }),
  setBannerDeleting: (deleting: boolean) =>
    set(() => ({ bannerDeleting: deleting }), false, {
      type: "setBannerDeleting",
    }),
});

// REPORT STORE
const reportStore = (set: Function) => ({
  // initial state
  report: undefined,
  reportsByState: undefined,
  submittedReportsByState: undefined,
  lastSavedTime: undefined,
  workPlanToCopyFrom: undefined,
  autosaveState: false,
  editable: true,
  // actions
  setReport: (newReport: ReportShape | undefined) =>
    set(() => ({ report: newReport }), false, { type: "setReport" }),
  setReportsByState: (newReportsByState: ReportMetadataShape[] | undefined) =>
    set(() => ({ reportsByState: newReportsByState }), false, {
      type: "setReportsByState",
    }),
  clearReportsByState: () =>
    set(() => ({ reportsByState: undefined }), false, {
      type: "clearReportsByState",
    }),
  setSubmittedReportsByState: (
    newSubmittedReportsByState: ReportMetadataShape[] | undefined
  ) =>
    set(
      () => ({ submittedReportsByState: newSubmittedReportsByState }),
      false,
      { type: "setSubmittedReportsByState" }
    ),
  setLastSavedTime: (savedTime: string | undefined) =>
    set(() => ({ lastSavedTime: savedTime }), false, {
      type: "setLastSavedTime",
    }),
  setWorkPlanToCopyFrom: (planToCopy: ReportShape | undefined | null) =>
    set(() => ({ workPlanToCopyFrom: planToCopy }), false, {
      type: "setWorkPlanToCopyFrom",
    }),
  setAutosaveState: (state: boolean) =>
    set(() => ({ autosaveState: state }), false, {
      type: "setAutosaveState",
    }),
  setEditable: (state: boolean) =>
    set(() => ({ editable: state }), false, {
      type: "setEditable",
    }),
});

// ENTITY STORE
const entityStore = (set: Function) => ({
  // initial state
  selectedEntity: undefined,
  // actions
  setSelectedEntity: (newSelectedEntity: EntityShape | undefined) =>
    set(
      () => ({
        selectedEntity: newSelectedEntity,
      }),
      false,
      {
        type: "setSelectedEntity",
      }
    ),
  clearSelectedEntity: () =>
    set(() => ({ selectedEntity: undefined }), false, {
      type: "clearSelectedEntity",
    }),
});

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<MfpUserState & AdminBannerState & MfpReportState & MfpEntityState>(
      (set) => ({
        ...userStore(set),
        ...bannerStore(set),
        ...reportStore(set),
        ...entityStore(set),
      })
    ),
    {
      name: "mfp-store",
    }
  )
);
