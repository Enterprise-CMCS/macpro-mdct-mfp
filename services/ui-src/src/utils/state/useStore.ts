import { MFPUser } from "types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MfpState {
  user: MFPUser | null;
  setUser: (newUser: MFPUser | null) => void;
  showLocalLogins: boolean | undefined;
  setShowLocalLogins: (showLocalLogins: boolean) => void;
  loginWithIDM?: () => void;
  logout: () => void;
}

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<MfpState>(
      (set) => ({
        // initial user state
        user: null,
        // log in as new user
        setUser: (newUser: MFPUser | null) => set(() => ({ user: newUser })),
        // show local logins
        showLocalLogins: undefined,
        // toggle show local logins
        setShowLocalLogins: () => set(() => ({ showLocalLogins: true })),
        // clear current user
        logout: () => set(() => ({ user: null })),
      }),
      {
        enabled: true,
      }
    ),
    {
      name: "users-store",
    }
  )
);
