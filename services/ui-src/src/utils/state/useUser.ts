import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// types
import { MfpUserState, MFPUser } from "types";

export const useUser = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<MfpUserState>((set) => ({
      // INITIAL STATE
      user: null,
      // show local logins
      showLocalLogins: undefined,
      // ACTIONS
      setUser: (newUser: MFPUser | null) =>
        set(() => ({ user: newUser }), false, "setUser"),
      // toggle show local logins
      setShowLocalLogins: () =>
        set(() => ({ showLocalLogins: true }), false, "setShowLocalLogins"),
    })),
    {
      name: "user-store",
    }
  )
);
