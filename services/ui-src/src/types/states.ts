import {
  AdminBannerData,
  AnyObject,
  EntityShape,
  ErrorVerbiage,
  MFPUser,
  ReportMetadataShape,
  ReportRoute,
  ReportShape,
} from "types";
import { OptionalObjectSchema, TypeOfShape } from "yup/lib/object";

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
  allBanners: AdminBannerData[] | undefined;
  bannerData: AdminBannerData | undefined;
  bannerActive: boolean;
  bannerLoading: boolean;
  bannerErrorMessage: ErrorVerbiage | undefined;
  bannerDeleting: boolean;
  editable: boolean;
  // ACTIONS
  setAllBanners: (allBanners: AdminBannerData[] | undefined) => void;
  setBannerData: (newBannerData: AdminBannerData | undefined) => void;
  clearAdminBanner: () => void;
  setBannerActive: (bannerStatus: boolean) => void;
  setBannerLoading: (bannerLoading: boolean) => void;
  setBannerErrorMessage: (
    bannerErrorMessage: ErrorVerbiage | undefined,
  ) => void;
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
  editable: boolean;
  currentPageTemplate: ReportRoute | undefined;
  // ACTIONS
  setReport: (newReport: ReportShape | undefined) => void;
  setReportsByState: (
    newReportsByState: ReportMetadataShape[] | undefined,
  ) => void;
  clearReportsByState: () => void;
  setSubmittedReportsByState: (
    newSubmittedReportsByState: ReportMetadataShape[] | undefined,
  ) => void;
  setLastSavedTime: (lastSavedTime: string | undefined) => void;
  setWorkPlanToCopyFrom: (planToCopy: ReportShape | undefined) => void;
  setAutosaveState: (state: boolean) => void;
  setEditable: (state: boolean) => void;
  setCurrentPageTemplate: (template: ReportRoute | undefined) => void;
}

// initial entity state
export interface MfpEntityState {
  // INITIAL STATE
  selectedEntity: EntityShape | undefined;
  // ACTIONS
  setSelectedEntity: (newSelectedEntity: EntityShape | undefined) => void;
  clearSelectedEntity: () => void;
}

export type FIELD_ERROR = { message?: string; type?: string }
export type FIELD_DATA = {
  answer: any;
  error: FIELD_ERROR;
  validate: boolean;
};

export interface MfpFieldState {
  fields: Map<string, FIELD_DATA>;
  validationSchema: OptionalObjectSchema<AnyObject, AnyObject, TypeOfShape<AnyObject>> | undefined;
  rerender: boolean,
  setField: (id: string, value?: any) => void;
  setAnswer: (id: string, answer: any) => void;
  setValidationSchema: (schema: OptionalObjectSchema<AnyObject, AnyObject, TypeOfShape<AnyObject>> | undefined) => void;
  setErrors: (updateErrors: { [key: string]: FIELD_ERROR }) => void;
  setClearFields: () => void;
}
