// components
import { Box, Heading } from "@chakra-ui/react";
import { InstructionsAccordion } from "components";
import { ReportPeriod } from "./ReportPeriod";
// types
import { AnyObject } from "types";
// utils
import { parseCustomHtml } from "utils";

export const ReportPageIntro = ({
  text,
  accordion,
  initiativeName,
  reportPeriod,
  reportYear,
}: Props) => {
  const { section, subsection, info, introAccordion } = text;

  const isSubsectionPage = section && (subsection || initiativeName);

  const header = () => {
    return (
      <Heading as="h1" sx={sx.largeHeading}>
        {subsection}
      </Heading>
    );
  };

  const headerSubsection = () => {
    return (
      <>
        <Heading as="h1" sx={sx.smallHeading}>
          {section}
        </Heading>
        <Heading as="h2" sx={sx.largeHeading}>
          {initiativeName ?? subsection}
        </Heading>
      </>
    );
  };

  return (
    <Box sx={sx.introBox}>
      {isSubsectionPage ? headerSubsection() : header()}

      {/* accordion specifically nested in the intro verbiage */}
      {introAccordion && <InstructionsAccordion verbiage={introAccordion} />}

      {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}

      {accordion && <InstructionsAccordion verbiage={accordion} />}

      {/* SAR Reporting Period section */}
      <ReportPeriod
        text={text}
        reportPeriod={reportPeriod}
        reportYear={reportYear}
      />
    </Box>
  );
};

interface Props {
  text: AnyObject;
  accordion?: AnyObject;
  initiativeName?: string;
  reportPeriod?: number;
  reportYear?: number;
}

const sx = {
  introBox: {
    marginBottom: "spacer2",
    p: {
      marginBottom: "spacer2",
      marginTop: "0",
    },
  },
  smallHeading: {
    color: "gray",
    fontSize: "md",
  },
  largeHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
    marginTop: "spacer1",
  },
  infoTextBox: {
    color: "gray_dark",
    marginTop: "spacer2",
    h3: {
      marginBottom: "-0.75rem",
    },
    a: {
      color: "primary",
      "&:hover": {
        color: "primary_darker",
      },
    },
    ".mdct-achievements-list": {
      color: "gray_dark",
      columnGap: "spacer5",
      columns: "2",
      paddingLeft: "spacer2",
      "li::before": {
        color: "gray_dark",
      },
    },
    ".mdct-instructions-text": {
      borderTopColor: "gray_lighter",
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      color: "gray_dark",
      paddingTop: "spacer4",
    },
    ".mdct-instructions-list": {
      marginBottom: "spacer4",
      marginLeft: "spacer5",
      li: {
        marginBottom: "spacer2",
      },
    },
    ".mdct-instructions-list-roman": {
      listStyleType: "upper-roman",
      marginBottom: "spacer5",
      marginLeft: "spacer5",
      li: {
        padding: "spacer1",
      },
    },
    ".mdct-smalltext": {
      color: "gray",
      fontSize: "xs",
      marginBottom: "spacer5",
      marginTop: "0.625rem",
    },
    ".mdct-table": {
      th: {
        borderColor: "gray_lighter",
        color: "gray",
        fontSize: "sm",
        fontWeight: "600",
        textTransform: "capitalize",
      },
      td: {
        borderBottomColor: "gray_lighter",
        verticalAlign: "top",
      },
      li: {
        marginTop: "spacer1",
        "&:first-of-type": {
          marginTop: "0",
        },
      },
    },
  },
};
