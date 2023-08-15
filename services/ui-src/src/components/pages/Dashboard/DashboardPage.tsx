import { Link as RouterLink } from "react-router-dom";
// components
import { Image, Link, Box, Heading } from "@chakra-ui/react";
import { PageTemplate, InstructionsAccordion } from "components";
import { parseCustomHtml } from "utils";
// verbiage
import wpVerbiage from "verbiage/pages/wp/wp-dashboard";
import accordion from "verbiage/pages/accordion";
// assets
import arrowLeftIcon from "../../../assets/icons/icon_arrow_left_blue.png";

export const DashboardPage = ({ reportType }: Props) => {
  const dashboardVerbiageMap: any = {
    WP: wpVerbiage,
  };

  const dashboardVerbiage = dashboardVerbiageMap[reportType]!;

  const { intro } = dashboardVerbiage;

  return (
    <PageTemplate type="report" sx={sx.layout}>
      <Link as={RouterLink} to="/" sx={sx.returnLink}>
        <Image src={arrowLeftIcon} alt="Arrow left" className="returnIcon" />
        Return Home
      </Link>
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        {reportType === "WP" && (
          <InstructionsAccordion verbiage={accordion.WP.stateUserDashboard} />
        )}
        {parseCustomHtml(intro.body)}
      </Box>
    </PageTemplate>
  );
};

interface Props {
  reportType: string;
}

const sx = {
  layout: {
    ".contentFlex": {
      maxWidth: "appMax",
      marginTop: "1rem",
      marginBottom: "3.5rem",
    },
  },
  returnLink: {
    display: "flex",
    width: "8.5rem",
    svg: {
      height: "1.375rem",
      width: "1.375rem",
      marginTop: "-0.125rem",
      marginRight: ".5rem",
    },
    textDecoration: "none",
    _hover: {
      textDecoration: "underline",
    },
    ".returnIcon": {
      width: "1.25rem",
      height: "1.25rem",
      marginTop: "0.25rem",
      marginRight: "0.5rem",
    },
  },
  leadTextBox: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "2.5rem auto",
    ".tablet &, .mobile &": {
      margin: "2.5rem 0 1rem",
    },
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
    ".tablet &, .mobile &": {
      fontSize: "xl",
      lineHeight: "1.75rem",
      fontWeight: "bold",
    },
  },
  bodyBox: {
    maxWidth: "55.25rem",
    margin: "0 auto",
    ".desktop &": {
      width: "100%",
    },
    ".tablet &, .mobile &": {
      margin: "0",
    },
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
  emptyTableContainer: {
    maxWidth: "75%",
    margin: "0 auto",
    textAlign: "center",
  },
  callToActionContainer: {
    marginTop: "2.5rem",
    textAlign: "center",
  },
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: "10",
  },
};
