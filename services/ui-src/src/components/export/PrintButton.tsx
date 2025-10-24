import { Link as RouterLink } from "react-router-dom";
// components
import { Button, Image, SystemStyleObject } from "@chakra-ui/react";
// assets
import iconSearch from "assets/icons/icon_search_blue.png";
import iconPDF from "assets/icons/icon_pdf_white.png";
// utils
import { useStore } from "utils";

export const PrintButton = ({ sxOverride }: Props) => {
  const report = useStore().report;
  const reportType = report?.reportType === "WP" ? "wp" : "sar";

  const isNonEditable =
    report?.status === "Submitted" || report?.status === "Approved";
  const styling = !isNonEditable ? sx.printButton : sx.downloadButton;
  return (
    <Button
      as={RouterLink}
      to={`/${reportType}/export`}
      target="_blank"
      sx={{ ...styling, ...sxOverride }}
      leftIcon={
        !isNonEditable ? (
          <Image src={iconSearch} alt="Search Icon" height="1rem" />
        ) : (
          <Image src={iconPDF} alt="PDF Icon" height="1rem" />
        )
      }
      variant={!isNonEditable ? "outline" : "primary"}
    >
      {!isNonEditable ? "Review PDF" : "Download PDF"}
    </Button>
  );
};

export interface Props {
  sxOverride?: SystemStyleObject;
}

const sx = {
  printButton: {
    minWidth: "6rem",
    height: "2.375rem",
    fontSize: "md",
    fontWeight: "700",
    border: "1px solid",
  },
  downloadButton: {
    minWidth: "6rem",
    height: "2.375rem",
    fontSize: "md",
    fontWeight: "700",
    color: "white !important",
    textDecoration: "none !important",
    "&:hover, &:focus": {
      backgroundColor: "primary",
      color: "white",
    },
  },
};
