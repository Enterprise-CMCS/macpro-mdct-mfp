import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// types
import { MfpUserState, MFPUser } from "types";

// USER STORE
const userStore = (set: Function) => ({
  // initial state
  user: null,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser: MFPUser | null) =>
    set(() => ({ user: newUser }), false, "setUser"),
  // toggle show local logins (dev only)
  setShowLocalLogins: () =>
    set(() => ({ showLocalLogins: true }), false, "setShowLocalLogins"),
});

// BANNER STORE
const bannerStore = (set: Function) => ({});

// REPORT STORE
const reportStore = (set: Function) => ({});

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<MfpUserState>((set) => ({
      ...userStore(set),
      ...bannerStore(set),
      ...reportStore(set),
    })),
    {
      name: "mfp-store",
    }
  )
);
