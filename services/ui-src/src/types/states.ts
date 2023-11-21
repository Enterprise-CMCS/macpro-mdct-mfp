import {
  AdminBannerData,
  EntityShape,
  MFPUser,
  ReportMetadataShape,
  ReportShape,
} from "types";

// initial user state
export interface MfpUserState {
  // INITIAL STATE
  user?: MFPUser;
  showLocalLogins: boolean | undefined;
  // ACTIONS
  setUser: (newUser?: MFPUser) => void;
  setShowLocalLogins: (showLocalLogins: boolean) => void;
}

// initial admin banner state
export interface AdminBannerState {
  // INITIAL STATE
  bannerData: AdminBannerData | undefined;
  bannerActive: boolean;
  bannerLoading: boolean;
  bannerErrorMessage: string;
  bannerDeleting: boolean;
  // ACTIONS
  setBannerData: (newBannerData: AdminBannerData | undefined) => void;
  clearAdminBanner: () => void;
  setBannerActive: (bannerStatus: boolean) => void;
  setBannerLoading: (bannerLoading: boolean) => void;
  setBannerErrorMessage: (bannerErrorMessage: string) => void;
  setBannerDeleting: (bannerDeleting: boolean) => void;
}

// initial report state
export interface MfpReportState {
  // INITIAL STATE
  report: ReportShape | undefined;
  reportsByState: ReportMetadataShape[] | undefined;
  submittedReportsByState: ReportMetadataShape[] | undefined;
  lastSavedTime: string | undefined;
  workPlanToCopyFrom: ReportShape | undefined;
  autosaveState: boolean;
  // ACTIONS
  setReport: (newReport: ReportShape | undefined) => void;
  setReportsByState: (
    newReportsByState: ReportMetadataShape[] | undefined
  ) => void;
  clearReportsByState: () => void;
  setSubmittedReportsByState: (
    newSubmittedReportsByState: ReportMetadataShape[] | undefined
  ) => void;
  setLastSavedTime: (lastSavedTime: string | undefined) => void;
  setWorkPlanToCopyFrom: (planToCopy: ReportShape | undefined) => void;
  setAutosaveState: (state: boolean) => void;
}

// initial entity state
export interface MfpEntityState {
  // INITIAL STATE
  selectedEntity: EntityShape | undefined;
  // ACTIONS
  setSelectedEntity: (newSelectedEntity: EntityShape | undefined) => void;
  clearSelectedEntity: () => void;
}
