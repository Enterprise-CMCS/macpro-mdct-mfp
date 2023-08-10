import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Auth } from "aws-amplify";
// config
import config from "config";
// types
import { MFPUser } from "types";

interface MfpUserState {
  // initial state
  user: MFPUser | null;
  showLocalLogins: boolean | undefined;
  // actions
  setUser: (newUser: MFPUser | null) => void;
  setShowLocalLogins: (showLocalLogins: boolean) => void;
  loginWithIDM: () => void;
  logout: () => Promise<void>;
}

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<MfpUserState>(
      (set) => ({
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
        // login with IDM
        loginWithIDM: async () => {
          const authConfig = Auth.configure();
          if (authConfig?.oauth) {
            const oAuthOpts = authConfig.oauth;
            const domain = oAuthOpts.domain;
            const responseType = oAuthOpts.responseType;
            const redirectSignIn = (oAuthOpts as any).redirectSignIn;
            const clientId = authConfig.userPoolWebClientId;
            const url = `https://${domain}/oauth2/authorize?identity_provider=Okta&redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${clientId}`;
            window.location.assign(url);
          }
          const cognitoHostedUrl = new URL(
            `https://${config.cognito.APP_CLIENT_DOMAIN}/oauth2/authorize?identity_provider=${config.cognito.COGNITO_IDP_NAME}&redirect_uri=${config.APPLICATION_ENDPOINT}&response_type=CODE&client_id=${config.cognito.APP_CLIENT_ID}&scope=email openid profile`
          );
          window.location.replace(cognitoHostedUrl);
        },
        // log out current user
        logout: async () => {
          try {
            set({ user: null });
            await Auth.signOut();
            localStorage.clear();
          } catch (error) {
            console.log(error); // eslint-disable-line no-console
          }
          window.location.href = config.POST_SIGNOUT_REDIRECT;
        },
      }),
      {
        enabled: true,
      }
    ),
    {
      name: "user-store",
    }
  )
);
