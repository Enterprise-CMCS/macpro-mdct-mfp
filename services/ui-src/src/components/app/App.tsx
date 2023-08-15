import { useContext, useEffect } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
// components
import { Container, Divider, Flex, Heading, Stack } from "@chakra-ui/react";
import {
  AppRoutes,
  Error,
  Footer,
  Header,
  LoginCognito,
  LoginIDM,
  SkipNav,
  Timeout,
  PostLogoutRedirect,
} from "components";
// utils
import {
  fireTealiumPageView,
  makeMediaQueryClasses,
  UserContext,
  useUser,
} from "utils";

export const App = () => {
  const mqClasses = makeMediaQueryClasses();
  const context = useContext(UserContext);
  const { logout } = context;
  const { user, showLocalLogins } = useUser();
  const { pathname, key } = useLocation();

  // fire tealium page view on route change
  useEffect(() => {
    fireTealiumPageView(user, window.location.href, pathname);
  }, [key]);

  const authenticatedRoutes = (
    <>
      {user && (
        <Flex sx={sx.appLayout}>
          <Timeout />
          <SkipNav
            id="skip-nav-main"
            href={"#main-content"}
            text={`Skip to ${"main content"}`}
            sxOverride={sx.skipnav}
          />

          <Header handleLogout={logout} />
          <Container sx={sx.appContainer} data-testid="app-container">
            <ErrorBoundary FallbackComponent={Error}>
              <AppRoutes />
            </ErrorBoundary>
          </Container>
          <Footer />
        </Flex>
      )}
      {!user && showLocalLogins && (
        <main>
          <Container sx={sx.appContainer}>
            <Heading as="h1" size="xl" sx={sx.loginHeading}>
              Money Follows People
            </Heading>
          </Container>
          <Container sx={sx.loginContainer} data-testid="login-container">
            <Stack spacing={8}>
              <LoginIDM />
              <Divider />
              <LoginCognito />
            </Stack>
          </Container>
        </main>
      )}
    </>
  );

  return (
    <div id="app-wrapper" className={mqClasses}>
      <Routes>
        <Route path="*" element={authenticatedRoutes} />
        <Route path="postLogout" element={<PostLogoutRedirect />} />
      </Routes>
    </div>
  );
};

const sx = {
  appLayout: {
    minHeight: "100vh",
    flexDirection: "column",
  },
  skipnav: {
    position: "absolute",
  },
  appContainer: {
    display: "flex",
    maxW: "appMax",
    flex: "1 0 auto",
    ".desktop &": {
      padding: "0 2rem",
    },
    "#main-content": {
      section: {
        flex: "1",
      },
    },
  },
  loginContainer: {
    maxWidth: "25rem",
    height: "full",
    marginY: "auto",
  },
  loginHeading: {
    my: "6rem",
    textAlign: "center",
    width: "100%",
  },
};
