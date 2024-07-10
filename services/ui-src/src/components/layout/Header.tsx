import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
// components
import { UsaBanner } from "@cmsgov/design-system";
import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
import { Menu, MenuOption, ReportContext } from "components";
// utils
import { useBreakpoint, useStore } from "utils";
// assets
import appLogo from "assets/logos/logo_mdct_mfp.png";
import getHelpIcon from "assets/icons/icon_help.png";
import checkIcon from "assets/icons/icon_check_gray.png";
import closeIcon from "assets/icons/icon_cancel_x_circle.png";

export const Header = ({ handleLogout }: Props) => {
  const { isMobile } = useBreakpoint();
  const { report } = useStore() ?? {};
  const { lastSavedTime, isReportPage } = useContext(ReportContext);

  const saveStatusText = "Last saved " + lastSavedTime;

  return (
    <Box sx={sx.root} id="header">
      <Flex sx={sx.usaBannerContainer}>
        <UsaBanner />
      </Flex>
      <Flex sx={sx.headerBar} role="navigation">
        <Container sx={sx.headerContainer}>
          <Flex sx={sx.headerFlex}>
            <Link as={RouterLink} to="/" variant="unstyled">
              <Image src={appLogo} alt="MFP logo" sx={sx.appLogo} />
            </Link>
            <Flex sx={sx.menuFlex}>
              <Link
                as={RouterLink}
                to="/help"
                variant="unstyled"
                aria-label="Get Help"
              >
                <MenuOption
                  icon={getHelpIcon}
                  text="Get Help"
                  altText="Help"
                  role="group"
                  hideText={isMobile}
                />
              </Link>
              <Menu handleLogout={handleLogout} />
            </Flex>
          </Flex>
        </Container>
      </Flex>
      {isReportPage && (
        <Flex sx={sx.subnavBar}>
          <Container sx={sx.subnavContainer}>
            <Flex sx={sx.subnavFlex}>
              <Flex>
                <Text sx={sx.submissionNameText}>{report?.submissionName}</Text>
              </Flex>
              <Flex sx={sx.subnavFlexRight}>
                {lastSavedTime && (
                  <>
                    <Image
                      src={checkIcon}
                      alt="gray checkmark icon"
                      sx={sx.checkIcon}
                    />
                    <Text sx={sx.saveStatusText}>{saveStatusText}</Text>
                  </>
                )}
                <Link
                  as={RouterLink}
                  to={report?.formTemplate.basePath || "/"}
                  sx={sx.leaveFormLink}
                  variant="outlineButton"
                  tabIndex={-1}
                >
                  {!isMobile ? (
                    <>Leave form</>
                  ) : (
                    <Image src={closeIcon} alt="Close" sx={sx.closeIcon} />
                  )}
                </Link>
              </Flex>
            </Flex>
          </Container>
        </Flex>
      )}
    </Box>
  );
};

interface Props {
  handleLogout: () => void;
}

const sx = {
  root: {
    position: "sticky",
    top: 0,
    zIndex: "sticky",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    "@media print": {
      display: "none",
    },
  },
  usaBannerContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "palette.gray_lightest",
    ".desktop &": {
      padding: "0 1rem",
    },
  },
  headerBar: {
    minHeight: "4rem",
    alignItems: "center",
    bg: "palette.primary_darkest",
  },
  headerContainer: {
    maxW: "appMax",
    ".desktop &": {
      padding: "0 2rem",
    },
  },
  headerFlex: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuFlex: {
    alignItems: "center",
  },
  appLogo: {
    maxWidth: "200px",
  },
  subnavBar: {
    bg: "palette.secondary_lightest",
  },
  subnavContainer: {
    maxW: "appMax",
    ".desktop &": {
      padding: "0 2rem",
    },
  },
  subnavFlex: {
    height: "60px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submissionNameText: {
    fontWeight: "bold",
  },
  subnavFlexRight: {
    alignItems: "center",
    paddingRight: ".5rem",
  },
  checkIcon: {
    marginRight: "0.5rem",
    boxSize: "1rem",
    ".mobile &": {
      display: "none",
    },
  },
  saveStatusText: {
    fontSize: "sm",
    ".mobile &": {
      width: "5rem",
      textAlign: "right",
    },
  },
  leaveFormLink: {
    marginLeft: "1rem",
  },
  closeIcon: {
    width: "2rem",
  },
};
