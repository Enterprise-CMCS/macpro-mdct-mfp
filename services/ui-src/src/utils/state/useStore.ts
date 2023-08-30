import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Auth } from "aws-amplify";
import config from "config";
// types
import {
  MfpUserState,
  MFPUser,
  AdminBannerData,
  AdminBannerState,
  ReportShape,
  MfpReportState,
  ReportMetadataShape,
} from "types";
import { getExpiration, updateTimeout } from "utils/auth/authLifecycle";

// USER STORE
const userStore = (set: Function) => ({
  // initial state
  user: null,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser: MFPUser | null) =>
    set(() => ({ user: newUser }), false, { type: "setUser" }),
  // toggle show local logins (dev only)
  setShowLocalLogins: () =>
    set(() => ({ showLocalLogins: true }), false, { type: "showLocalLogins" }),
  // context actions
  logout: async () => {
    try {
      useStore().setUser(null);
      await Auth.signOut();
      localStorage.clear();
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
    window.location.href = config.POST_SIGNOUT_REDIRECT;
  },
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
  updateTimeout: updateTimeout,
  getExpiration: getExpiration,
});

// BANNER STORE
const bannerStore = (set: Function) => ({
  // initial state
  bannerData: undefined,
  isBannerActive: false,
  // actions
  setAdminBanner: (newBanner: AdminBannerData | undefined) =>
    set(() => ({ bannerData: newBanner }), false, { type: "setAdminBanner" }),
  clearAdminBanner: () =>
    set(() => ({ bannerData: undefined }), false, { type: "clearAdminBanner" }),
  setIsBannerActive: (bannerStatus: boolean) =>
    set(() => ({ isBannerActive: bannerStatus }), false, {
      type: "setIsBannerActive",
    }),
});

// REPORT STORE
const reportStore = (set: Function) => ({
  // initial state
  report: undefined,
  reportsByState: undefined,
  submittedReportsByState: undefined,
  // actions
  setReport: (newReport: ReportShape | undefined) =>
    set(() => ({ report: newReport }), false, { type: "setReport" }),
  setReportsByState: (newReportsByState: ReportMetadataShape[] | undefined) =>
    set(() => ({ reportsByState: newReportsByState }), false, {
      type: "setReportsByState",
    }),
  clearReportsByState: () =>
    set(() => ({ reportsByState: undefined }), false, {
      type: "clearReportsByState",
    }),
  setSubmittedReportsByState: (
    newSubmittedReportsByState: ReportMetadataShape[] | undefined
  ) =>
    set(
      () => ({ submittedReportsByState: newSubmittedReportsByState }),
      false,
      { type: "setSubmittedReportsByState" }
    ),
});

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<MfpUserState & AdminBannerState & MfpReportState>((set) => ({
      ...userStore(set),
      ...bannerStore(set),
      ...reportStore(set),
    })),
    {
      name: "mfp-store",
    }
  )
);
