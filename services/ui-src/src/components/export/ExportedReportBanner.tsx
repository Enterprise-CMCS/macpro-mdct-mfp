// components
import { Box, Button, Image, Text } from "@chakra-ui/react";
// assets
import pdfIcon from "assets/icons/icon_pdf_white.png";
// types
import { ReportType } from "types";
// utils
import { getReportVerbiage, useStore } from "utils";

export const ExportedReportBanner = () => {
  const { report } = useStore() ?? {};
  const reportType = (report?.reportType ||
    localStorage.getItem("selectedReportType")) as ReportType;

  const { exportVerbiage } = getReportVerbiage(reportType);
  const { reportBanner } = exportVerbiage;

  const onClickHandler = () => {
    window?.print();
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
    marginBottom: "spacer4",
    padding: "2rem 2rem",
    background: "white",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    ".mobile &": {
      padding: "2rem 1rem",
    },
    ".tablet &, .mobile &": {
      position: "static",
    },
    "@media print": {
      display: "none",
    },
    p: {
      marginBottom: "spacer2",
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
      marginRight: "spacer1",
    },
  },
};
