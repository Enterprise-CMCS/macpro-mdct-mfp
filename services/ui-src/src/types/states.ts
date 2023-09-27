import {
  AdminBannerData,
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
  isBannerActive: boolean;
  // ACTIONS
  setAdminBanner: (newBannerData: AdminBannerData | undefined) => void;
  clearAdminBanner: () => void;
  setIsBannerActive: (bannerStatus: boolean) => void;
}

// initial report state
export interface MfpReportState {
  // INITIAL STATE
  report: ReportShape | undefined;
  reportsByState: ReportMetadataShape[] | undefined;
  submittedReportsByState: ReportMetadataShape[] | undefined;
  // ACTIONS
  setReport: (newReport: ReportShape | undefined) => void;
  setReportsByState: (
    newReportsByState: ReportMetadataShape[] | undefined
  ) => void;
  clearReportsByState: () => void;
  setSubmittedReportsByState: (
    newSubmittedReportsByState: ReportMetadataShape[] | undefined
  ) => void;
}
