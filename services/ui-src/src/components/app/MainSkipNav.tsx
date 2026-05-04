import { SkipNav } from "components";

/**
 * The app's top-level skip nav always targets the main content region.
 */
export const MainSkipNav = () => {
  return (
    <SkipNav
      id="skip-nav-main"
      href="#main-content"
      text="Skip to main content"
      sxOverride={sx.skipnav}
    />
  );
};

const sx = {
  skipnav: {
    position: "absolute",
  },
};
