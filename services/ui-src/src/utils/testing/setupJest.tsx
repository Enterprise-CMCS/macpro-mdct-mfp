import React from "react";
import { BrowserRouter as Router } from "react-router";
import { configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Keep IS_REACT_ACT_ENVIRONMENT enabled during RTL async polling (React 19).
configure({
  asyncWrapper: async (cb) => {
    const prev = (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    try {
      return await cb();
    } finally {
      (globalThis as any).IS_REACT_ACT_ENVIRONMENT = prev;
    }
  },
});

// types
import {
  UserRoles,
  MfpUserState,
  UserContextShape,
  AdminBannerState,
  MfpReportState,
  ReportShape,
  MfpEntityState,
  entityTypes,
} from "types";
// utils
import { mockBannerData } from "./mockBanner";
import {
  mockWPApprovedFullReport,
  mockWPSubmittedReport,
  mockWPFullReport,
  mockWPCopiedReport,
  mockSARFullReport,
  mockEvaluationPlan,
  mockObjectiveProgress,
  mockWPArchivedReport,
} from "./mockReport";

// GLOBALS

global.React = React;
global.structuredClone = (val: any) =>
  val ? JSON.parse(JSON.stringify(val)) : val;

/* Mocks window.matchMedia (https://bit.ly/3Qs4ZrV) */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

window.scrollBy = jest.fn();
window.scrollTo = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

/* Mock Amplify */
jest.mock("aws-amplify/api", () => ({
  get: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  post: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  put: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  del: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
}));

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn().mockReturnValue({
    idToken: () => ({
      payload: "eyJLongToken",
    }),
  }),
  signOut: jest.fn().mockImplementation(() => Promise.resolve()),
  signInWithRedirect: () => {},
}));

// USER CONTEXT

export const mockUserContext: UserContextShape = {
  user: undefined,
  logout: async () => {},
  loginWithIDM: async () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

// USER STATES / STORE

export const mockNoUserStore: MfpUserState = {
  user: undefined,
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateUserStore: MfpUserState = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
    userIsEndUser: true,
  },
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateApproverStore: MfpUserState = {
  user: {
    userRole: UserRoles.APPROVER,
    email: "stateapprover@test.com",
    given_name: "Zara",
    family_name: "Zustimmer",
    full_name: "Zara Zustimmer",
    state: "MN",
    userIsAdmin: true,
  },
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockHelpDeskUserStore: MfpUserState = {
  user: {
    userRole: UserRoles.HELP_DESK,
    email: "helpdeskuser@test.com",
    given_name: "Clippy",
    family_name: "Helperson",
    full_name: "Clippy Helperson",
    state: undefined,
    userIsReadOnly: true,
  },
  showLocalLogins: false,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockAdminUserStore: MfpUserState = {
  user: {
    userRole: UserRoles.ADMIN,
    email: "adminuser@test.com",
    given_name: "Adam",
    family_name: "Admin",
    full_name: "Adam Admin",
    state: undefined,
    userIsAdmin: true,
  },
  showLocalLogins: false,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

//  BANNER STATES / STORE

export const mockBannerStore: AdminBannerState = {
  allBanners: [mockBannerData],
  bannerData: mockBannerData,
  bannerActive: false,
  bannerLoading: false,
  bannerErrorMessage: { title: "", description: "" },
  bannerDeleting: false,
  editable: true,
  setBannerData: () => {},
  clearAdminBanner: () => {},
  setAllBanners: () => {},
  setBannerActive: () => {},
  setBannerLoading: () => {},
  setBannerErrorMessage: () => {},
  setBannerDeleting: () => {},
};

// REPORT STATES / STORE

export const mockReportStore: MfpReportState = {
  report: mockWPFullReport as ReportShape,
  reportsByState: [
    mockWPFullReport,
    mockWPSubmittedReport,
    mockWPCopiedReport,
    mockWPApprovedFullReport,
    mockWPArchivedReport,
  ],
  submittedReportsByState: [mockWPFullReport],
  lastSavedTime: "1:58 PM",
  workPlanToCopyFrom: undefined,
  autosaveState: false,
  editable: true,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
  setWorkPlanToCopyFrom: () => {},
  setAutosaveState: () => {},
  setEditable: () => {},
};

export const mockSARReportStore: MfpReportState = {
  report: mockSARFullReport as ReportShape,
  reportsByState: [],
  submittedReportsByState: [mockSARFullReport],
  lastSavedTime: "1:58 PM",
  workPlanToCopyFrom: undefined,
  autosaveState: false,
  editable: true,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
  setWorkPlanToCopyFrom: () => {},
  setAutosaveState: () => {},
  setEditable: () => {},
};

export const mockEntityStore: MfpEntityState = {
  selectedEntity: {
    id: "mock-id",
    type: entityTypes[0],
    initiative_name: "mock-initiative-name",
  },
  // ACTIONS
  setSelectedEntity: () => {},
  clearSelectedEntity: () => {},
};

export const mockEvaluationPlanEntityStore: MfpEntityState = {
  selectedEntity: {
    id: "mock-id",
    type: "evaluationPlan",
    initiative_name: "mock-initiative-name",
    evaluationPlan: mockEvaluationPlan,
  },
  // ACTIONS
  setSelectedEntity: () => {},
  clearSelectedEntity: () => {},
};

export const mockObjectiveProgressEntityStore: MfpEntityState = {
  selectedEntity: {
    id: "mock-id",
    type: "objectiveProgress",
    initiative_name: "mock-initiative-name",
    objectiveProgress: mockObjectiveProgress,
  },
  // ACTIONS
  setSelectedEntity: () => {},
  clearSelectedEntity: () => {},
};

export const mockEmptyReportStore: MfpReportState = {
  report: undefined,
  reportsByState: undefined,
  submittedReportsByState: undefined,
  lastSavedTime: undefined,
  workPlanToCopyFrom: undefined,
  autosaveState: false,
  editable: true,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
  setWorkPlanToCopyFrom: () => {},
  setAutosaveState: () => {},
  setEditable: () => {},
};

// BOUND STORE

export const mockUseStore: MfpUserState & AdminBannerState & MfpReportState = {
  ...mockReportStore,
  ...mockStateUserStore,
  ...mockBannerStore,
};

export const mockUseSARStore: MfpUserState & AdminBannerState & MfpReportState =
  {
    ...mockSARReportStore,
    ...mockStateUserStore,
    ...mockBannerStore,
  };

export const mockUseEmptyReportStore: MfpUserState &
  AdminBannerState &
  MfpReportState = {
  ...mockEmptyReportStore,
  ...mockStateUserStore,
  ...mockBannerStore,
};

export const mockUseAdminStore: MfpUserState &
  AdminBannerState &
  MfpReportState = {
  ...mockReportStore,
  ...mockAdminUserStore,
  ...mockBannerStore,
};

export const mockUseEntityStore: MfpUserState &
  AdminBannerState &
  MfpReportState &
  MfpEntityState = {
  ...mockReportStore,
  ...mockStateUserStore,
  ...mockBannerStore,
  ...mockEntityStore,
};

export const mockUseEvaluationPlanEntityStore: MfpUserState &
  AdminBannerState &
  MfpReportState &
  MfpEntityState = {
  ...mockUseStore,
  ...mockEvaluationPlanEntityStore,
};

export const mockUseObjectiveProgressEntityStore: MfpUserState &
  AdminBannerState &
  MfpReportState &
  MfpEntityState = {
  ...mockUseSARStore,
  ...mockObjectiveProgressEntityStore,
};

// ROUTER

export const RouterWrappedComponent: React.FC<{ children: any }> = ({
  children,
}) => <Router>{children}</Router>;

// ASSET
export * from "./mockAsset";
// BANNER
export * from "./mockBanner";
// ENTITIES
export * from "./mockEntities";
// FORM
export * from "./mockForm";
// LAUNCHDARKLY
export * from "./mockLaunchDarkly";
// REPORT
export * from "./mockReport";
// ROUTER
export * from "./mockRouter";
