// USERS

export enum UserRoles {
  ADMIN = "mdctmfp-bor", // "MDCT MFP Business Owner Representative"
  APPROVER = "mdctmfp-approver", // "MDCT MFP Approver"
  HELP_DESK = "mdctmfp-help-desk", // "MDCT MFP Help Desk"
  INTERNAL = "mdctmfp-cms-internal-user", // "MDCT MFP Internal User"
  STATE_USER = "mdctmfp-state-user", // "MDCT MFP State User"
}

export interface MFPUser {
  email: string;
  given_name: string;
  family_name: string;
  full_name: string;
  state?: string;
  userRole?: string;
  userIsAdmin?: boolean;
  userIsReadOnly?: boolean;
  userIsEndUser?: boolean;
}

export interface UserContextShape {
  user?: MFPUser;
  getExpiration: Function;
  logout: () => Promise<void>;
  loginWithIDM: () => Promise<void>;
  showLocalLogins?: boolean;
  updateTimeout: () => void;
}
