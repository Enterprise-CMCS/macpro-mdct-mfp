import { useFlags } from "launchdarkly-react-client-sdk";
// assets
import pdfIcon from "assets/icons/icon_pdf_white.png";
// components
import { Box, Button, Image, Text } from "@chakra-ui/react";
// utils
import { printPdf, useStore } from "utils";
// types
import { ReportType } from "types";
// verbiage
import wpVerbiage from "verbiage/pages/wp/wp-export";
import sarVerbiage from "verbiage/pages/sar/sar-export";

export const ExportedReportBanner = () => {
  const { report } = useStore() ?? {};
  const reportType = (report?.reportType ||
    localStorage.getItem("selectedReportType")) as ReportType;

  const verbiageMap: { [key in ReportType]: any } = {
    WP: wpVerbiage,
    SAR: sarVerbiage,
  };

  const verbiage = verbiageMap[reportType];
  const { reportBanner } = verbiage;
  const printExperience = useFlags()?.printExperience;

  const onClickHandler = () => {
    if (printExperience === "prince") printPdf();
    else window?.print();
  };

  return (
    <Box data-testid="exportedReportBanner" sx={sx.container}>
      <Text>{reportBanner.intro}</Text>
      <Button sx={sx.pdfButton} onClick={onClickHandler}>
        <Image src={pdfIcon} w={5} alt="PDF Icon" />
        {reportBanner.pdfButton}
      </Button>
    </Box>
  );
};

const sx = {
  container: {
    position: "sticky",
    zIndex: "sticky",
    top: "0",
    marginBottom: "2rem",
    padding: "3rem 2rem",
    background: "white",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    ".mobile &": {
      padding: "2rem 1rem",
    },
    "@media print": {
      display: "none",
    },
    p: {
      marginBottom: "1rem",
      fontSize: "xl",
      fontWeight: "bold",
      ".mobile &": {
        fontSize: "lg",
      },
    },
  },
  pdfButton: {
    img: {
      width: "1rem",
      marginRight: "0.5rem",
    },
  },
};
