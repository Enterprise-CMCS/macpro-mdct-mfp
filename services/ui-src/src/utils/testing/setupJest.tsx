import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
import { mockFlags, resetLDMocks } from "jest-launchdarkly-mock";

// utils
import { UserContextShape, UserRoles } from "types/users";

// GLOBALS

global.React = React;

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

/* From Chakra UI Accordion test file (https://bit.ly/3MFtwXq) */
jest.mock("@chakra-ui/transition", () => ({
  ...jest.requireActual("@chakra-ui/transition"),
  Collapse: jest.fn(({ in: inProp, children }: any) => (
    <div hidden={!inProp}>{children}</div>
  )),
}));

/* Mock LaunchDarkly (see https://bit.ly/3QAeS7j) */
export const mockLDFlags = {
  setDefault: (baseline: any) => mockFlags(baseline),
  clear: resetLDMocks,
  set: mockFlags,
};

// USERS

export const mockNoUser: UserContextShape = {
  user: undefined,
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateUser: UserContextShape = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
    userIsStateUser: true,
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateRep: UserContextShape = {
  user: {
    userRole: UserRoles.STATE_REP,
    email: "staterep@test.com",
    given_name: "Robert",
    family_name: "States",
    full_name: "Robert States",
    state: "MA",
    userIsStateRep: true,
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateApprover: UserContextShape = {
  user: {
    userRole: UserRoles.APPROVER,
    email: "stateapprover@test.com",
    given_name: "Zara",
    family_name: "Zustimmer",
    full_name: "Zara Zustimmer",
    state: "MN",
    userIsApprover: true,
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockHelpDeskUser: UserContextShape = {
  user: {
    userRole: UserRoles.HELP_DESK,
    email: "helpdeskuser@test.com",
    given_name: "Clippy",
    family_name: "Helperson",
    full_name: "Clippy Helperson",
    state: undefined,
    userIsHelpDeskUser: true,
  },
  showLocalLogins: false,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockAdminUser: UserContextShape = {
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
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

// AUTH

jest.mock("aws-amplify", () => ({
  Auth: {
    currentSession: jest.fn().mockReturnValue({
      getIdToken: () => ({
        getJwtToken: () => "eyJLongToken",
      }),
    }),
    currentAuthenticatedUser: () => {},
    configure: () => {},
    signOut: async () => {},
    federatedSignIn: () => {},
  },
  API: {
    get: () => {},
    post: () => {},
    put: () => {},
    del: () => {},
    configure: () => {},
  },
  Hub: {
    listen: jest.fn(),
  },
}));

// ROUTER

export const RouterWrappedComponent: React.FC = ({ children }) => (
  <Router>{children}</Router>
);

// LAUNCHDARKLY

export const mockLDClient = {
  variation: jest.fn(() => true),
};

// FORM
export * from "./mockForm";
// ENTITIES
export * from "./mockEntities";
