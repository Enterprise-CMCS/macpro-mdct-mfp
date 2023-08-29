import { MFPUser } from "types";

// initial user state
export interface MfpUserState {
  // INITIAL STATE
  user: MFPUser | null;
  showLocalLogins: boolean | undefined;
  // ACTIONS
  setUser: (newUser: MFPUser | null) => void;
  setShowLocalLogins: (showLocalLogins: boolean) => void;
}
